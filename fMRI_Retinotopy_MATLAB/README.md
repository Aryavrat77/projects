# fMRI Analysis of Retinotopy in Visual Cortex
> MATLAB analysis of BOLD signals to study visual cortex retinotopy and eccentricity effects

## Overview
This project analyzes fMRI data to study retinotopy (retinal mapping) in the visual cortex by examining BOLD (Blood-oxygen-level-dependent) signals in response to varying visual stimuli. The analysis focuses on how different visual eccentricities affect cortical activity patterns.

## Key Features
* Visualization of cortical flatmaps using fMRI voxel data
* Generation of standard deviation maps to show signal variability
* BOLD response analysis over time for individual voxels
* Event-related BOLD response visualization for different visual conditions
* Animated visualization of retinotopic mapping for six eccentricity conditions

## Dependencies
* MATLAB R2021b
* Required dataset files:
  - `exampledataset.mat` (containing fMRI time series and eccentricity data)

## Data Structure
The dataset includes:
* `data`: Cell array containing voxel activity data for 4 trials
* `design`: Cell array containing condition markers for 6 eccentricity levels
* `imglookup`: Matrix for 2D visualization of 3D voxel positions
* `extrapmask`: Binary matrix distinguishing cortex from boundaries

## Usage

### Basic Data Processing
```matlab
% Load and prepare data
load('exampledataset.mat')

% Calculate average voxel activity across trials
average_voxel = (voxel_trial1 + voxel_trial2 + voxel_trial3 + voxel_trial4)/4;
numvoxels = size(average_voxel,1);

% Compute standard deviation for activity variability
stdmap = std(average_voxel,[],2);
```

### Visualization
```matlab
% Create cortex flatmap
time_point = randi([1,size(average_voxel,2)],1);
onetimepoint = average_voxel(:,time_point);
onetimepoint = onetimepoint(imglookup);
onetimepoint(extrapmask) = nan;

% Display flatmap
figure(1)
imagesc(onetimepoint)
colormap(jet)
colorbar
```

### BOLD Signal Analysis
```matlab
% Plot BOLD signal for random voxel
random_voxel = randi([1,size(average_voxel,1)],1);
time = (0:size(average_voxel,2)-1) / (1/tr);

figure(2)
plot(time,average_voxel(random_voxel,:),'k','LineWidth',2)
```

### Retinotopy Animation
```matlab
% Create animation for all conditions
for timei = 1:size(erBOLD,3)
    for condi = 1:6
        timepointmap = squeeze(erBOLD(condi,:,timei));
        timepointmap = timepointmap(imglookup);
        timepointmap = conv2(timepointmap,G,'same');
        timepointmap(extrapmask) = NaN;
        set(imh(condi),'CData',timepointmap)
    end
    pause(.2)
end
```

## Results
The analysis produces several key visualizations:
1. Cortical flatmaps showing activity patterns at specific timepoints
2. Standard deviation maps displaying signal variability
3. BOLD signal time courses for individual voxels
4. Animated visualization of activity patterns for different eccentricity conditions

Key findings:
* BOLD signal intensity varies with visual stimulus eccentricity
* Activity patterns move further from the visual cortex as eccentricity increases
* Individual voxels show distinct temporal patterns of activity

## Output Files
* `project.dat`: Contains fit parameters and analysis for random voxel BOLD signals
* `Onetimepointmap.fig`: Saves the cortex flatmap visualization
* `stdmap.fig`: Saves the standard deviation map

## References
* Kay, K. et al. "A temporal decomposition method for identifying venous effects in task-based fMRI"
* Dataset available at OSF and OpenNeuro

