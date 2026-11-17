package com.gaminglab.product;

import java.util.List;

public record ProductFilters(List<String> categories, List<String> brands, List<String> platforms,
                             List<String> features) {}
