package com.traceback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Wraps a page of results plus pagination metadata. Returned as the `data`
 * field of ApiResponse for GET /api/cases so large result sets don't have
 * to be sent (and rendered) all at once.
 */
@Data
@Builder
public class PagedResponse<T> {
    private List<T> items;

    @JsonProperty("total_items")
    private long totalItems;

    @JsonProperty("total_pages")
    private int totalPages;

    private int page;
    private int size;

    @JsonProperty("has_next")
    private boolean hasNext;

    public static <T> PagedResponse<T> from(Page<T> page) {
        return PagedResponse.<T>builder()
                .items(page.getContent())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
                .size(page.getSize())
                .hasNext(page.hasNext())
                .build();
    }
}
