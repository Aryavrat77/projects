package com.R4.EMS.service;

import com.R4.EMS.entity.Education;
import com.R4.EMS.entity.Employee;
import com.R4.EMS.repository.EducationRepository;
import com.R4.EMS.repository.EmployeeRepository;
import com.R4.generated.dto.EducationDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EducationService {


    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EducationRepository educationRepository;

    @Autowired
    private ModelMapper modelMapper;

    public EducationDto addEmployeeEducation(UUID id, EducationDto body) {

        Employee employee = employeeRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Employee not found with id: " +id));
        body.setEmployeeId(employee.getId());
        Education education = modelMapper.map(body, Education.class);
        education.setEmployeeId(employee.getId());
        educationRepository.save(education);
        return body;
    }

    public void deleteEmployeeEducation(UUID id){
        educationRepository.deleteById(id);
    }

    public List<EducationDto> getEmployeeEducation(UUID id) {
        List<Education> educationList = educationRepository.findAllByEmployeeId(id);
        return educationList.stream()
                .map(education -> modelMapper.map(education, EducationDto.class))
                .collect(Collectors.toList());
    }

    public void updateEducation(UUID id, EducationDto body) {

        Education education = educationRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("education not found with id: " +body.getEducationId()));

        education.setUniversityName(body.getUniversityName());
        education.setDegreeType(body.getDegreeType());
        education.setAdvancedDegreeType(body.getAdvancedDegreeType());
        education.setMajor(body.getMajor());
        education.setStartDate(body.getStartDate());
        education.setEndDate(body.getEndDate());
        education.setCity(body.getCity());
        education.setState(body.getState());
        education.setCountry(body.getCountry());

        educationRepository.save(education);
    }
}
