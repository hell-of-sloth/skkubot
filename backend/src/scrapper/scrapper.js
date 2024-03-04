const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { timeEnd } = require('console');

// 현재 작업 디렉토리에 'download' 디렉토리의 경로를 생성합니다.
const downloadDir = path.join(__dirname, 'download');

const txtDir = path.join(__dirname, 'txt_files');

// 'download' 디렉토리가 존재하는지 확인하고, 없으면 생성합니다.
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

if (!fs.existsSync(txtDir)) {
    fs.mkdirSync(txtDir);
}

const run = async () => {
    // headless로 크롬 드라이버 실행
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options()
                // "--no-sandbox", "--disable-dev-shm-usage" 옵션은 리눅스 환경에서 필요한 옵션입니다.
                .addArguments(
                    '--disable-gpu',
                    'window-size=1920x1080',
                    'lang=ko_KR',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--headless',
                )
                .setUserPreferences({
                    'download.default_directory': downloadDir,
                }),
        )
        .setChromeService(new chrome.ServiceBuilder('/bin/chromedriver')) // WSL에서 chromedriver 경로를 지정해줍니다.
        .build();

    try {
        // 특정 URL 생성
        await driver.get(
            'https://www.skku.edu/skku/campus/skk_comm/notice01.do?mode=list&&articleLimit=10&article.offset=10',
        );
        let userAgent = await driver.executeScript(
            'return navigator.userAgent;',
        );
        console.log('[UserAgent]: ', userAgent);

        // By.className으로 board-list-content-title class를 가진 element들을 찾는다.
        let resultElements = await driver.findElements(
            By.className('board-list-content-title'),
        );

        // searchInput.sendKeys(keyword, Key.ENTER);

        // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
        // await driver.wait(
        //   until.elementLocated(By.id("info.search.place.list")),
        //   10000
        // );
        // let resultElements = await driver.findElements(By.className("placetit"));

        let urls = [];
        // 검색한 elements 하위의 value를 출력함
        console.log('[resultElements.length]', resultElements.length);
        for (let i = 0; i < resultElements.length; i++) {
            // resultElements[i]의 <a> 태그 element를 가져온다.
            console.log(
                `resultElements${i}의 카테고리: ` +
                    (await resultElements[i]
                        .findElement(By.css('span'))
                        .getText()),
            );
            const aTagElement = await resultElements[i].findElement(
                By.css('a'),
            ); // Use findElement instead of findElements
            const url = await aTagElement.getAttribute('href');
            urls.push(url);
        }

        // Promise.allSettled를 사용하여 모든 Promise가 처리될 때까지 기다린다.

        // *************현재 문제 발생으로 인하여 보류*************

        // Promise.allSettled(urls.map(async (url) => {
        //   await driver.get(url);
        //   await driver.wait(until.elementLocated(By.css("div.container")), 10000);

        //   const boardElement = await driver.findElement(
        //     By.css("dl.board-write-box.board-write-box-v03")
        //   );
        //   try { // 기본 양식
        //     const contentText = await boardElement
        //       .findElement(By.css("dd"))
        //       .findElement(By.css("pre.pre"))
        //       .getText();
        //     console.log("내용: " + contentText);
        //   } catch (e) { // 기본양식이 아닐 경우
        //     const contentTextList = await driver.findElement(By.css("div.fr-view"))
        //       .findElements(By.css("p"))
        //     console.log("내용: ");
        //     Promise.allSettled(contentTextList.map(async (contentText) => {
        //       console.log(await contentText.getText());
        //     }));
        //   }

        //   // 파일 다운로드
        //   const fileElement = await driver.findElement(By.css("a.file"));
        //   const isFileExist = await fileElement
        //     .findElement(By.css("span"))
        //     .getText();

        //   // 파일이 존재하면 다운로드
        //   if (isFileExist != "( 0 )") {
        //     fileElement.click();

        //     // 압축으로 다운 받기
        //     /*
        //     const downloadElement = await driver.findElement(By.css("ul.filedown_btnList"))
        //       .findElement(By.css("li"))
        //       .findElement(By.css("button"));
        //     await downloadElement.click();
        //     */

        //     // 파일 하나씩 다운 받기
        //     const downloadElements = await driver.findElement(By.css("ul.filedown_list"))
        //       .findElements(By.css("li"));
        //     for (let content of downloadElements) {
        //       await content.findElement(By.css("a")).click();
        //     }
        //   }
        // })).then((result) => {
        //   console.log(result);
        // }).catch((e) => {
        //   console.log(e);
        // });

        // 기존 방식
        for (let url of urls) {
            await driver.get(url);
            await driver.wait(
                until.elementLocated(By.css('div.container')),
                10000,
            );

            const boardElement = await driver.findElement(
                By.css('dl.board-write-box.board-write-box-v03'),
            );
            let title = await driver
                .findElement(By.css('em.ellipsis'))
                .getText();

            title = title.substring(0, 30);
            title = title.replace(/[^\w\s.\-가-힣]/g, ''); // Replace characters other than word characters, spaces, dots, hyphens, and Korean characters

            try {
                // 기본 양식
                const contentText = await boardElement
                    .findElement(By.css('dd'))
                    .findElement(By.css('pre.pre'))
                    .getText();
                console.log('내용: ' + contentText);
                fs.writeFileSync(
                    path.join(txtDir, `${title}.txt`),
                    contentText,
                );
            } catch (e) {
                // 기본양식이 아닐 경우
                console.log('log:');
                console.log(e);
                console.log('---log end---');
                const contentTextList = await driver
                    .findElement(By.css('div.fr-view'))
                    .findElements(By.css('p'));
                console.log('내용: ');
                Promise.allSettled(
                    contentTextList.map(async (contentText) => {
                        console.log(await contentText.getText());
                        fs.appendFileSync(
                            path.join(txtDir, `${title}.txt`),
                            await contentText.getText(),
                        );
                    }),
                );
            }

            // 파일 다운로드
            const fileElement = await driver.findElement(By.css('a.file'));
            const isFileExist = await fileElement
                .findElement(By.css('span'))
                .getText();

            // 파일이 존재하면 다운로드
            if (isFileExist != '( 0 )') {
                fileElement.click();

                // 압축으로 다운 받기
                /*
        const downloadElement = await driver.findElement(By.css("ul.filedown_btnList"))
          .findElement(By.css("li"))
          .findElement(By.css("button"));
        await downloadElement.click();
        */

                // 파일 하나씩 다운 받기
                const downloadElements = await driver
                    .findElement(By.css('ul.filedown_list'))
                    .findElements(By.css('li'));
                for (let content of downloadElements) {
                    await content.findElement(By.css('a')).click();
                }
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        driver.quit();
    }
};

run();
