package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.User;

import com.mongodb.devrel.library.resources.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User loginUser(String userName) {
        Optional<User> user = userRepository.findUserByName(userName);
        User loggedInUser = user.orElse(createNewUser());

        return loggedInUser;
    }

    public User createNewUser() {
        // generate User Name using ramdom strings
        String[] adjectives = {"Abrasive", "Brash", "Callous", "Daft", "Eccentric", "Fiesty", "Golden", "Holy", "Ignominious", "Joltin", "Killer", "Luscious", "Mushy", "Nasty", "OldSchool", "Pompous", "Quiet", "Rowdy", "Sneaky", "Tawdry"};
        String[] animals = {"Alligator", "Barracuda", "Cheetah", "Dingo", "Elephant", "Falcon", "Gorilla", "Hyena", "Iguana", "Jaguar", "Koala", "Lemur", "Mongoose", "Narwhal", "Orangutan", "Platypus", "Quetzal", "Rhino", "Scorpion", "Tarantula"};
        
        Random random = new Random();
        String randomAdjective = adjectives[random.nextInt(adjectives.length)];
        String randomAnimal = animals[random.nextInt(animals.length)];
        
        String userName = randomAdjective + " " + randomAnimal;
        
        // create and insert the newly created user
        User newUser = new User();
        newUser.setName(userName);
        newUser.setAdmin(true);

        newUser = userRepository.insert(newUser);
    
        return newUser;
    }

    public Optional<User> userById(ObjectId id) {
        System.out.println(id);
        return userRepository.findById(id);
    }
}
