package com.traceback.service;

import com.traceback.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Stores uploaded case photos on local disk under `app.upload.dir` and
 * returns a URL the frontend can use directly in an <img> tag, served via
 * FileUploadConfig's resource handler at /uploads/**.
 *
 * This replaces the earlier approach of embedding photos as base64 data
 * URLs directly in the `cases.photo` column, which bloated the database
 * and made every case list/detail response heavier than necessary.
 *
 * For production behind multiple app instances, swap this for S3/GCS/Azure
 * Blob storage — the method signatures here would stay the same, only the
 * implementation changes.
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final long MAX_SIZE_BYTES = 8L * 1024 * 1024; // 8MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.public-path:/uploads}")
    private String publicPath;

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No file provided.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "File too large. Maximum size is 8MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only JPEG, PNG, WEBP, or GIF images are allowed.");
        }

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);

            String extension = extensionFor(contentType);
            String filename = UUID.randomUUID() + extension;
            Path target = dir.resolve(filename);

            // Guard against path traversal even though the filename is fully generated, not user-supplied.
            if (!target.getParent().equals(dir)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file path.");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return StringUtils.trimTrailingCharacter(publicPath, '/') + "/" + filename;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the uploaded file.");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> "";
        };
    }

    public List<String> allowedTypes() {
        return List.copyOf(ALLOWED_TYPES);
    }
}
