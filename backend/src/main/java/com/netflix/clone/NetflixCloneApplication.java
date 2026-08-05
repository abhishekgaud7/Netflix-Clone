package com.netflix.clone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NetflixCloneApplication {

    public static void main(String[] args) {
        SpringApplication.run(NetflixCloneApplication.class, args);
        System.out.println("\n==================================================");
        System.out.println("🚀 Netflix Clone Backend Running on Port 8080");
        System.out.println("==================================================\n");
    }
}
