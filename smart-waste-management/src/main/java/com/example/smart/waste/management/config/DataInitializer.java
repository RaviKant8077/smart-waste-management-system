package com.example.smart.waste.management.config;

import com.example.smart.waste.management.model.Page;
import com.example.smart.waste.management.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PageRepository pageRepository;

    @Override
    public void run(String... args) throws Exception {
        // seed a few known pages if they do not exist
        Arrays.asList(
                Page.builder().name("Dashboard").path("/dashboard").description("Admin & user dashboard").build(),
                Page.builder().name("Reports").path("/reports").description("Reports and exports").build(),
                Page.builder().name("Users").path("/users").description("User management").build(),
                Page.builder().name("Routes").path("/routes").description("Route management").build(),
                Page.builder().name("Complaints").path("/complaints").description("Complaints center").build()
        ).forEach(p -> {
            pageRepository.findByPath(p.getPath()).orElseGet(() -> pageRepository.save(p));
        });
    }
}
