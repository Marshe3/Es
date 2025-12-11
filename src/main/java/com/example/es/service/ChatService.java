package com.example.es.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final RestTemplate restTemplate;
    private final String apiKey;

    public ChatService(@Value("${openai.api.key}") String apiKey) {
        this.restTemplate = new RestTemplate();
        this.apiKey = apiKey;
        logger.info("OpenAI API 키 로드됨. 길이: {}", apiKey != null ? apiKey.length() : 0);
    }

    public String getChatResponse(String userMessage, String skinType) {
        try {
            String url = "https://api.openai.com/v1/chat/completions";

            // 시스템 프롬프트 구성
            String systemPrompt = String.format(
                "당신은 피부 관리 전문가입니다. 사용자의 피부 타입은 '%s'입니다. " +
                "이 피부 타입에 맞는 맞춤형 조언을 제공해주세요. " +
                "답변은 친근하고 이해하기 쉽게 한국어로 작성해주세요.",
                skinType != null ? skinType : "알 수 없음"
            );

            // OpenAI API 요청 본문 구성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");

            // 메시지 배열 구성
            List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
            );
            requestBody.put("messages", messages);

            // 헤더 설정 (Authorization 포함)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
            ).getBody();

            // 응답에서 텍스트 추출
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }

            return "죄송합니다. 응답을 생성할 수 없습니다.";

        } catch (Exception e) {
            logger.error("OpenAI API 호출 중 오류 발생: {}", e.getMessage(), e);
            if (e.getCause() != null) {
                logger.error("원인: {}", e.getCause().getMessage());
            }
            return "죄송합니다. 일시적인 오류가 발생했습니다: " + e.getMessage();
        }
    }
}
