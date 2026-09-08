package com.foodloop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FoodLoopApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodLoopApplication.class, args);
    }
}
