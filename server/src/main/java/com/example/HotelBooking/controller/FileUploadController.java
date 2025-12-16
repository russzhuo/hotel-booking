package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.ApiResponse;
import com.example.HotelBooking.dto.UploadByLinkRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/upload-photo")
    public ResponseEntity<ApiResponse> uploadPhotos(@RequestParam("files") List<MultipartFile> files) {
        if (files == null || files.isEmpty() || files.stream().allMatch(f -> f.isEmpty())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No files provided or all files are empty"));
        }

        List<String> uploadedFileNames = new ArrayList<>();

        Path uploadDirPath = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();

        try {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    log.warn("Skipping empty file in multi-upload");
                    continue;
                }

                String originalFilename = StringUtils.cleanPath(
                        Objects.requireNonNull(file.getOriginalFilename())
                );

                if (originalFilename.contains("..") || originalFilename.startsWith("/")) {
                    throw new IllegalArgumentException("Invalid file path: " + originalFilename);
                }


                // Sanitize and generate safe filename
                String fileExtension = StringUtils.getFilenameExtension(originalFilename);
                String baseName = StringUtils.stripFilenameExtension(originalFilename);
                String safeBaseName = baseName.replaceAll("[^a-zA-Z0-9_-]", "_");
                String fileName = UUID.randomUUID() + "_" + safeBaseName +
                        (fileExtension != null ? "." + fileExtension : "");

                Path targetLocation = uploadDirPath.resolve(fileName).normalize().toAbsolutePath();
                log.info("uploadDirPath.toAbsolutePath: {}", uploadDirPath.toAbsolutePath());
                log.info("targetLocation: {}", targetLocation);

                if (!targetLocation.startsWith(uploadDirPath.toAbsolutePath())) {
                    throw new SecurityException("Cannot store file outside upload directory");
                }


                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                uploadedFileNames.add(fileName);
                log.info("Uploaded: {} (original: {})", fileName, originalFilename);
            }

            return ResponseEntity.ok(
                    ApiResponse.success(uploadedFileNames, "Successfully uploaded " + uploadedFileNames.size() + " file(s)")
            );

        } catch (Exception e) {
            log.error("Failed to upload files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Upload failed"));
        }
    }

    @PostMapping("/upload-photo-by-link")
    public ResponseEntity<ApiResponse> uploadPhotosByLink(@RequestBody UploadByLinkRequest uploadByLinkRequest) throws MalformedURLException {
        String imageUrl = uploadByLinkRequest.link();

        log.info("imageUrl: {}", imageUrl);

        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Image URL is required"));
        }

        Path uploadDirPath = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();

        log.info("uploadDirPath.toAbsolutePath: {}", uploadDirPath.toAbsolutePath());

        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            String fileExtension = StringUtils.getFilenameExtension(imageUrl);
            String baseName = UUID.randomUUID().toString();
            String fileName = baseName + "_upload." + (fileExtension != null ? fileExtension : "");

            Path targetLocation = uploadDirPath.resolve(fileName).normalize().toAbsolutePath();

            log.info("Target location (abs path): {}", uploadDirPath.toAbsolutePath());

            if (!targetLocation.startsWith(uploadDirPath.toAbsolutePath())) {
                throw new SecurityException("Cannot store file outside upload directory");
            }

            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Downloaded and saved image from {} as {}", imageUrl, fileName);
            return ResponseEntity.ok().body(ApiResponse.success(fileName, "Successfully uploaded: " + fileName));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
