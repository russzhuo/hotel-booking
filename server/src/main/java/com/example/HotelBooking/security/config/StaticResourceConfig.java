package com.example.HotelBooking.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;

@Configuration
@EnableWebMvc
public class StaticResourceConfig implements WebMvcConfigurer {
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDirPath = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/resources/**")
                .addResourceLocations("file:" + uploadDirPath.toAbsolutePath() + File.separator)
                .setCachePeriod(3600)
                .setUseLastModified(true);
    }
}
