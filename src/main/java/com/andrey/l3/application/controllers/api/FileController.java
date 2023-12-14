package com.andrey.l3.application.controllers.api;

import com.andrey.l3.application.models.FileInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@RestController
public class FileController {
    @GetMapping("/api/viewFolder")
    public List<FileInfo> viewFiles (@RequestParam("path") String filePath) {
        List<FileInfo> result = new ArrayList<>();

        File folder = new File(filePath);

        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles();

            if (files != null) {
                for (File file : files) {
                    result.add(mapToFileInfo(file));
                }
            }
        }

        return result;
    }

    private FileInfo mapToFileInfo(File file) {
        FileInfo fileInfo = new FileInfo();
        fileInfo.setFilename(file.getName());
        fileInfo.setType(file.isDirectory() ? "directory" : "file");
        fileInfo.setLastAccess(String.valueOf(file.lastModified()));
        fileInfo.setSize(formatSize(file.length()));
        return fileInfo;
    }

    private String formatSize(long size) {
        return size + "B";
    }
}
