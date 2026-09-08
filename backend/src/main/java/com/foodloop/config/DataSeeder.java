package com.foodloop.config;

import com.foodloop.entity.*;
import com.foodloop.enums.*;
import com.foodloop.repository.*;
import com.foodloop.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private FoodSafetyRecordRepository safetyRecordRepository;

    @Autowired
    private DonationHistoryRepository historyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DonationService donationService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println("🌱 Seeding realistic FoodLoop demo data relative to current time...");

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Create Users
        User donor1 = new User("Green Leaf Restaurant", "donor1@foodloop.org", "+91 9876543210", defaultPass, Role.DONOR);
        donor1.setAddress("Banjara Hills Road No 12, Hyderabad");
        userRepository.save(donor1);

        User donor2 = new User("Fresh Bites Bakery", "donor2@foodloop.org", "+91 9876543211", defaultPass, Role.DONOR);
        donor2.setAddress("Jubilee Hills Checkpost, Hyderabad");
        userRepository.save(donor2);

        User donor3 = new User("City Function Hall", "donor3@foodloop.org", "+91 9876543212", defaultPass, Role.DONOR);
        donor3.setAddress("Gachibowli Main Road, Hyderabad");
        userRepository.save(donor3);

        User vol1 = new User("Rahul Sharma", "volunteer1@foodloop.org", "+91 9123456780", defaultPass, Role.VOLUNTEER);
        vol1.setAddress("Hitech City, Hyderabad");
        userRepository.save(vol1);

        User vol2 = new User("Ananya Verma", "volunteer2@foodloop.org", "+91 9123456781", defaultPass, Role.VOLUNTEER);
        vol2.setAddress("Kondapur, Hyderabad");
        userRepository.save(vol2);

        User ngo1 = new User("Helping Hands Shelter", "ngo1@foodloop.org", "+91 9988776655", defaultPass, Role.ORGANIZATION);
        ngo1.setOrganizationName("Helping Hands Foundation");
        ngo1.setOrganizationType("Shelter Home");
        ngo1.setAddress("Madhapur Metro Station Lane, Hyderabad");
        ngo1.setContactPerson("Ramesh Kumar");
        ngo1.setRequiredFoodCategories("Cooked Meals, Rice, Curries");
        userRepository.save(ngo1);

        User ngo2 = new User("Hope Community Kitchen", "ngo2@foodloop.org", "+91 9988776656", defaultPass, Role.ORGANIZATION);
        ngo2.setOrganizationName("Hope Kitchen NGO");
        ngo2.setOrganizationType("Community Kitchen");
        ngo2.setAddress("Kukatpally Housing Board, Hyderabad");
        ngo2.setContactPerson("Priya Das");
        ngo2.setRequiredFoodCategories("Bakery, Packaged Food, Fruits");
        userRepository.save(ngo2);

        User admin = new User("System Administrator", "admin@foodloop.org", "+91 9000000000", passwordEncoder.encode("admin123"), Role.ADMIN);
        userRepository.save(admin);

        LocalDateTime now = LocalDateTime.now();

        // 2. Create Donations in different realistic states relative to NOW

        // D1: URGENT (Expires in 45 minutes)
        Donation d1 = new Donation();
        d1.setDonor(donor1);
        d1.setFoodType("Vegetable Biryani & Mirchi Ka Salan");
        d1.setFoodCategory(FoodCategory.COOKED_MEALS);
        d1.setQuantity(40.0);
        d1.setUnit("servings");
        d1.setServings(40);
        d1.setFoodCondition("Needs Urgent Pickup");
        d1.setDietaryType("Veg");
        d1.setPreparedAt(now.minusHours(4));
        d1.setDonatedAt(now.minusHours(1));
        d1.setExpiryAt(now.plusMinutes(45)); // URGENT! < 1h remaining
        d1.setPickupAddress("Green Leaf Restaurant, Road No 12, Banjara Hills");
        d1.setLatitude(17.4156);
        d1.setLongitude(78.4347);
        d1.setSpecialInstructions("Packed in thermal boxes. Entrance via back door.");
        d1.setStatus(DonationStatus.AVAILABLE);
        d1.setImageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop");
        donationRepository.save(d1);
        donationService.recordHistory(d1, null, DonationStatus.AVAILABLE, donor1.getName(), "Donation created");

        // D2: EXPIRING SOON (Expires in 3.5 hours)
        Donation d2 = new Donation();
        d2.setDonor(donor2);
        d2.setFoodType("Freshly Baked Chapati & Dal Makhani");
        d2.setFoodCategory(FoodCategory.CURRIES);
        d2.setQuantity(60.0);
        d2.setUnit("servings");
        d2.setServings(60);
        d2.setFoodCondition("Fresh");
        d2.setDietaryType("Veg");
        d2.setPreparedAt(now.minusHours(2));
        d2.setDonatedAt(now.minusMinutes(30));
        d2.setExpiryAt(now.plusHours(3).plusMinutes(30)); // EXPIRING SOON (3.5h left)
        d2.setPickupAddress("Fresh Bites Bakery, Jubilee Hills Checkpost");
        d2.setLatitude(17.4319);
        d2.setLongitude(78.4073);
        d2.setSpecialInstructions("Please bring clean container bags.");
        d2.setStatus(DonationStatus.AVAILABLE);
        d2.setImageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop");
        donationRepository.save(d2);
        donationService.recordHistory(d2, null, DonationStatus.AVAILABLE, donor2.getName(), "Donation created");

        // D3: FRESH (Expires in 8 hours)
        Donation d3 = new Donation();
        d3.setDonor(donor3);
        d3.setFoodType("Assorted Pastries, Breads & Muffins");
        d3.setFoodCategory(FoodCategory.BAKERY);
        d3.setQuantity(15.0);
        d3.setUnit("kg");
        d3.setServings(45);
        d3.setFoodCondition("Fresh");
        d3.setDietaryType("Veg");
        d3.setPreparedAt(now.minusMinutes(45));
        d3.setDonatedAt(now.minusMinutes(15));
        d3.setExpiryAt(now.plusHours(8)); // FRESH (> 6h left)
        d3.setPickupAddress("City Function Hall, Gachibowli");
        d3.setLatitude(17.4401);
        d3.setLongitude(78.3489);
        d3.setSpecialInstructions("Stored at cool room temperature.");
        d3.setStatus(DonationStatus.AVAILABLE);
        d3.setImageUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop");
        donationRepository.save(d3);
        donationService.recordHistory(d3, null, DonationStatus.AVAILABLE, donor3.getName(), "Donation created");

        // D4: PICKUP ASSIGNED & IN TRANSIT
        Donation d4 = new Donation();
        d4.setDonor(donor1);
        d4.setVolunteer(vol1);
        d4.setOrganization(ngo1);
        d4.setFoodType("Paneer Butter Masala & Jeera Rice");
        d4.setFoodCategory(FoodCategory.COOKED_MEALS);
        d4.setQuantity(50.0);
        d4.setUnit("servings");
        d4.setServings(50);
        d4.setFoodCondition("Good");
        d4.setDietaryType("Veg");
        d4.setPreparedAt(now.minusHours(3));
        d4.setDonatedAt(now.minusHours(2));
        d4.setExpiryAt(now.plusHours(2));
        d4.setAssignedAt(now.minusMinutes(40));
        d4.setPickupStartedAt(now.minusMinutes(25));
        d4.setArrivedAt(now.minusMinutes(15));
        d4.setFoodCollectedAt(now.minusMinutes(10));
        d4.setDeliveryStartedAt(now.minusMinutes(5));
        d4.setPickupAddress("Green Leaf Restaurant, Banjara Hills");
        d4.setLatitude(17.4156);
        d4.setLongitude(78.4347);
        d4.setStatus(DonationStatus.PICKED_UP);
        d4.setImageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop");
        donationRepository.save(d4);

        donationService.recordHistory(d4, null, DonationStatus.AVAILABLE, donor1.getName(), "Created");
        donationService.recordHistory(d4, DonationStatus.AVAILABLE, DonationStatus.PICKUP_ASSIGNED, vol1.getName(), "Volunteer assigned");
        donationService.recordHistory(d4, DonationStatus.PICKUP_ASSIGNED, DonationStatus.PICKED_UP, vol1.getName(), "Food collected by Rahul");

        Pickup pickup4 = new Pickup();
        pickup4.setDonation(d4);
        pickup4.setVolunteer(vol1);
        pickup4.setAssignedAt(d4.getAssignedAt());
        pickup4.setPickupStartedAt(d4.getPickupStartedAt());
        pickup4.setArrivedAt(d4.getArrivedAt());
        pickup4.setFoodCollectedAt(d4.getFoodCollectedAt());
        pickup4.setDeliveryStartedAt(d4.getDeliveryStartedAt());
        pickup4.setStatus(PickupStatus.DELIVERY_STARTED);
        pickup4.setDistanceKm(1.8);
        pickupRepository.save(pickup4);

        // D5: DELIVERED (Completed rescue)
        Donation d5 = new Donation();
        d5.setDonor(donor3);
        d5.setVolunteer(vol2);
        d5.setOrganization(ngo2);
        d5.setFoodType("Fruit Baskets & Fresh Juices");
        d5.setFoodCategory(FoodCategory.FRUITS);
        d5.setQuantity(25.0);
        d5.setUnit("kg");
        d5.setServings(75);
        d5.setFoodCondition("Fresh");
        d5.setDietaryType("Vegan");
        d5.setPreparedAt(now.minusHours(6));
        d5.setDonatedAt(now.minusHours(5));
        d5.setExpiryAt(now.plusHours(12));
        d5.setAssignedAt(now.minusHours(4));
        d5.setFoodCollectedAt(now.minusHours(3));
        d5.setDeliveredAt(now.minusHours(2));
        d5.setPickupAddress("City Function Hall, Gachibowli");
        d5.setStatus(DonationStatus.DELIVERED);
        d5.setImageUrl("https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop");
        donationRepository.save(d5);

        donationService.recordHistory(d5, DonationStatus.AVAILABLE, DonationStatus.DELIVERED, vol2.getName(), "Successfully delivered to Hope Kitchen");

        // D6: EXPIRED
        Donation d6 = new Donation();
        d6.setDonor(donor1);
        d6.setFoodType("Cooked Rice & Mixed Vegetables");
        d6.setFoodCategory(FoodCategory.RICE);
        d6.setQuantity(20.0);
        d6.setUnit("servings");
        d6.setServings(20);
        d6.setFoodCondition("Expired");
        d6.setDietaryType("Veg");
        d6.setPreparedAt(now.minusHours(10));
        d6.setDonatedAt(now.minusHours(8));
        d6.setExpiryAt(now.minusMinutes(25)); // Expired 25 mins ago
        d6.setPickupAddress("Green Leaf Restaurant, Banjara Hills");
        d6.setStatus(DonationStatus.EXPIRED);
        d6.setImageUrl("https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop");
        donationRepository.save(d6);

        donationService.recordHistory(d6, DonationStatus.AVAILABLE, DonationStatus.EXPIRED, "SYSTEM_SCHEDULER", "Automated system mark: Expiry date reached");

        // D7: SPOILED (Reported physically spoiled)
        Donation d7 = new Donation();
        d7.setDonor(donor2);
        d7.setFoodType("Dairy Cream Desserts & Custard");
        d7.setFoodCategory(FoodCategory.DAIRY);
        d7.setQuantity(12.0);
        d7.setUnit("kg");
        d7.setServings(35);
        d7.setFoodCondition("Spoiled");
        d7.setDietaryType("Veg");
        d7.setPreparedAt(now.minusHours(7));
        d7.setDonatedAt(now.minusHours(5));
        d7.setExpiryAt(now.plusHours(1));
        d7.setSpoilageReportedAt(now.minusMinutes(40));
        d7.setPickupAddress("Fresh Bites Bakery, Jubilee Hills");
        d7.setStatus(DonationStatus.SPOILED);
        d7.setImageUrl("https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=600&auto=format&fit=crop");
        donationRepository.save(d7);

        donationService.recordHistory(d7, DonationStatus.AVAILABLE, DonationStatus.SPOILED, vol1.getName(), "Reported Spoiled: Temperature issue during summer storage");

        FoodSafetyRecord safety1 = new FoodSafetyRecord();
        safety1.setDonation(d7);
        safety1.setReportedBy(vol1);
        safety1.setConditionAtReport("Spoiled");
        safety1.setReason("Temperature issue");
        safety1.setDescription("Refrigeration unit failed at storage location. Milk curdled and sour aroma detected.");
        safety1.setActionTaken("Marked SPOILED. Quarantine and disposal initiated.");
        safetyRecordRepository.save(safety1);

        // 3. Create NGO Requests
        Request req1 = new Request();
        req1.setOrganization(ngo1);
        req1.setFoodType("Vegetable Biryani / Cooked Rice");
        req1.setQuantityRequired(35.0);
        req1.setPeopleCount(70);
        req1.setPriority(Priority.HIGH);
        req1.setRequiredBefore(now.plusHours(3));
        req1.setLocation("Madhapur Shelter Home, Hyderabad");
        req1.setStatus(RequestStatus.PENDING);
        requestRepository.save(req1);

        Request req2 = new Request();
        req2.setOrganization(ngo2);
        req2.setFoodType("Chapati & Curries");
        req2.setQuantityRequired(50.0);
        req2.setPeopleCount(100);
        req2.setPriority(Priority.EMERGENCY);
        req2.setRequiredBefore(now.plusHours(2));
        req2.setLocation("Kukatpally Community Kitchen, Hyderabad");
        req2.setStatus(RequestStatus.PENDING);
        requestRepository.save(req2);

        System.out.println("✅ FoodLoop Demo Data successfully seeded!");
    }
}
