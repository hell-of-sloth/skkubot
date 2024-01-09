const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const run = async () => {
  // headless로 크롬 드라이버 실행
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options()
        .headless()
        .addArguments("--disable-gpu", "window-size=1920x1080", "lang=ko_KR")
    )
    .build();

  try {
    // 특정 URL 생성
    await driver.get(
      "https://www.skku.edu/skku/campus/skk_comm/notice01.do?mode=list&&articleLimit=10&article.offset=0"
    );
    let userAgent = await driver.executeScript("return navigator.userAgent;");
    console.log("[UserAgent]: ", userAgent);

    // By.className으로 board-list-content-title class를 가진 element들을 찾는다.
    let resultElements = await driver.findElements(
      By.className("board-list-content-title")
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
    console.log("[resultElements.length]", resultElements.length);
    for (let i = 0; i < resultElements.length; i++) {
      // resultElements[i]의 <a> 태그 element를 가져온다.
      console.log(
        `resultElements${i}의 카테고리: ` +
          (await resultElements[i].findElement(By.css("span")).getText())
      );
      const aTagElement = await resultElements[i].findElement(By.css("a")); // Use findElement instead of findElements
      const url = await aTagElement.getAttribute("href");
      urls.push(url);
    }
    for (let url of urls) {
      await driver.get(url);
      await driver.wait(until.elementLocated(By.css("div.container")), 10000);

      const boardElement = await driver.findElement(
        By.css("dl.board-write-box.board-write-box-v03")
      );
      const contentText = await boardElement
        .findElement(By.css("dd"))
        .findElement(By.css("pre.pre"))
        .getText();
      console.log("내용: " + contentText);
    }
  } catch (e) {
    console.log(e);
  } finally {
    driver.quit();
  }
};
run();
