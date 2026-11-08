
package com.foodloop.tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class FoodLoopHomeTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {

        ChromeOptions options = new ChromeOptions();

        if (Boolean.getBoolean("selenium.headless")) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1920,1080");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
        }

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    // TC01: Verify FoodLoop homepage loads successfully
    @Test
    public void testFoodLoopHomepage() {

        driver.get("http://localhost:3000");

        String title = driver.getTitle();

        System.out.println("TC01: Homepage Test");

        assertFalse(title.isBlank(),
                "Homepage title should not be empty");

        assertTrue(driver.getCurrentUrl().contains("localhost:3000"),
                "Homepage should load successfully");

        System.out.println("TC01 PASSED: Homepage loaded successfully");
    }

    // TC02: Verify login page elements and demo shortcut
    @Test
    public void testLoginPageUI() {

        driver.get("http://localhost:3000/login");

        WebElement heading = driver.findElement(By.tagName("h2"));

        assertEquals("Welcome Back", heading.getText());

        WebElement email = driver.findElement(
                By.cssSelector("input[type='email']")
        );

        WebElement password = driver.findElement(
                By.cssSelector("input[type='password']")
        );

        assertTrue(email.isDisplayed());
        assertTrue(password.isDisplayed());

        WebElement signIn = driver.findElement(
                By.xpath("//button[normalize-space()='Sign In']")
        );

        assertTrue(signIn.isDisplayed());

        WebElement donorButton = driver.findElement(
                By.xpath("//button[contains(., 'Donor')]")
        );

        donorButton.click();

        assertEquals("donor1@foodloop.org",
                email.getAttribute("value"));

        assertEquals("password123",
                password.getAttribute("value"));

        System.out.println("TC02 PASSED: Login UI verified");
    }

    // TC03: Verify login with valid donor credentials
    @Test
    public void testValidDonorLogin() {

        driver.get("http://localhost:3000/login");

        WebElement donorButton = driver.findElement(
                By.xpath("//button[contains(., 'Donor')]")
        );

        donorButton.click();

        WebElement signIn = driver.findElement(
                By.cssSelector("button[type='submit']")
        );

        signIn.click();

        wait.until(ExpectedConditions.urlContains("/donor/dashboard"));

        assertTrue(driver.getCurrentUrl().contains("/donor/dashboard"),
                "Valid donor login should open donor dashboard");

        System.out.println("TC03 PASSED: Valid donor login successful");
    }

    // TC04: Verify login with invalid credentials
    @Test
    public void testInvalidLogin() {

        driver.get("http://localhost:3000/login");

        WebElement email = driver.findElement(
                By.cssSelector("input[type='email']")
        );

        WebElement password = driver.findElement(
                By.cssSelector("input[type='password']")
        );

        email.sendKeys("invaliduser@foodloop.org");
        password.sendKeys("WrongPassword123");

        WebElement signIn = driver.findElement(
                By.cssSelector("button[type='submit']")
        );

        signIn.click();

        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".bg-red-50")
                )
        );

        assertTrue(errorMessage.isDisplayed(),
                "Invalid login should display an error");

        assertTrue(driver.getCurrentUrl().contains("/login"),
                "User should remain on login page");

        System.out.println("TC04 PASSED: Invalid login rejected successfully");
    }

    @AfterEach
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
