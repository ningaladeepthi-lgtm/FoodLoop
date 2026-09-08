package com.foodloop.enums;

public enum UrgencyLevel {
    FRESH,         // > 6 hours remaining
    EXPIRING_SOON, // 2-6 hours remaining
    URGENT,        // 0-2 hours remaining
    EXPIRED        // <= 0 hours remaining
}
