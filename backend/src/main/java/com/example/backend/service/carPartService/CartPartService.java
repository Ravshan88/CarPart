package com.example.backend.service.carPartService;

import com.example.backend.dto.CartPartDTO;
import org.springframework.http.HttpEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface CartPartService {

    HttpEntity<?> addCarPart(CartPartDTO cartPartDTO, MultipartFile photo, String prefix);

    HttpEntity<?> editCarPart(CartPartDTO cartPartDTO, MultipartFile photo, String prefix);

    HttpEntity<?> getCarParts(String name);

    HttpEntity<?> changeActive(UUID id);

    HttpEntity<?> deleteCarPart(UUID id,UUID attachmentId,String attachmentName);
}
