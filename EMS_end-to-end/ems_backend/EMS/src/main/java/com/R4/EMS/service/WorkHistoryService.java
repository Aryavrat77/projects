package com.R4.EMS.service;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.entity.WorkHistory;
import com.R4.EMS.repository.EmployeeRepository;
import com.R4.EMS.repository.WorkHistoryRepository;
import com.R4.generated.dto.WorkHistoryDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkHistoryService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    WorkHistoryRepository workHistoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    public WorkHistoryDto addEmployeeWorkHistory(UUID id, WorkHistoryDto body) {

        Employee employee = employeeRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Employee not found with id:" +id));
        body.setEmployeeId(employee.getId());
        workHistoryRepository.save(modelMapper.map(body, WorkHistory.class));
        return body;
    }

    public void deleteEmployeeWorkHistory(UUID id) {
        workHistoryRepository.deleteById(id);
    }

    public List<WorkHistoryDto> getEmployeeWorkHistory(UUID id) {
        List<WorkHistory> workHistoryList = workHistoryRepository.findAllByEmployeeId(id);
        return workHistoryList.stream()
                .map(workHistory -> modelMapper.map(workHistory, WorkHistoryDto.class))
                .collect(Collectors.toList());
    }

    public void updateWorkHistory(UUID id, WorkHistoryDto body) {

        WorkHistory workHistory = workHistoryRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Work history not found with id:" +id));

        workHistory.setCompanyName(body.getCompanyName());
        workHistory.setStartDate(body.getStartDate());
        workHistory.setEndDate(body.getEndDate());
        workHistory.setIndustry(body.getIndustry());
        workHistory.setDuties(body.getDuties());
        workHistory.setManagerName(body.getManagerName());
        workHistory.setReasonForLeaving(body.getReasonForLeaving());

        workHistoryRepository.save(workHistory);
    }
}
