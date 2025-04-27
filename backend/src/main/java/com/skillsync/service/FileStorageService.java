package com.skillsync.service;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.gridfs.GridFsResource; 

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations operations;

    public String storeFile(MultipartFile file, String userId) throws IOException {
        DBObject metadata = new BasicDBObject();
        metadata.put("userId", userId);
        metadata.put("type", file.getContentType());
        return gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                metadata
        ).toString();
    }

    public byte[] getFile(String id) throws IOException {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        return IOUtils.toByteArray(operations.getResource(file).getInputStream());
    }

    public void deleteFile(String id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
    }

    public List<String> storeMultipleFiles(List<MultipartFile> files, String userId) throws IOException {
        List<String> fileIds = new ArrayList<>();
        for (MultipartFile file : files) {
            fileIds.add(storeFile(file, userId));
        }
        return fileIds;
    }

    public GridFSFile getGridFsFile(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    }
    
    public GridFsResource getGridFsResource(GridFSFile file) {
        return operations.getResource(file);
    }
}