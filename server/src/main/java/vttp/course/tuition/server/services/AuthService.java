package vttp.course.tuition.server.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vttp.course.tuition.server.repositories.AuthRepository;

@Service
public class AuthService {
    
    @Autowired
    private AuthRepository authRepo;

    public Optional<Boolean> login(String email, String password){  return authRepo.login(email, password); }

    
}
