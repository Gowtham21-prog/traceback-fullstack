package com.traceback.controller;

import com.traceback.dto.ApiResponse;
import com.traceback.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Real multipart upload endpoint, replacing the earlier approach of
 * stuffing a base64 data URL into the case-creation JSON payload.
 *
 * Frontend flow: upload the photo here first, get back a URL, then include
 * that URL as `photo` in the POST /api/cases payload — instead of reading
 * the file as a data URL client-side.
 */
@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/photo")
    public ApiResponse<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ApiResponse.ok(Map.of("url", url));
    }
}
