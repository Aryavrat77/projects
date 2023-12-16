% agupt110:20211209:project.m

%% Data Import 
clear 
load('exampledataset.mat')

%% Creating necessary variables

% Changes in cortical activity over time measured by change in quantified fMRI voxels
voxel_trial1 = data{1}; 
voxel_trial2 = data{2};
voxel_trial3 = data{3};
voxel_trial4 = data{4};

% Condition 1-6 for six different eccentricities/visual stimuli over time points
condition_trial1 = design{1}; 
condition_trial2 = design{2};
condition_trial3 = design{3};
condition_trial4 = design{4};

%% Numerical calculations for data processing 

% Calculating average of four trials for voxel data
average_voxel = (voxel_trial1 + voxel_trial2 + voxel_trial3 + voxel_trial4)/4;
numvoxels = size(average_voxel,1); % Number of voxels

% Computing the standard deviation to visualize variability in voxel activity in cortex regions
stdmap = std(average_voxel,[],2); % Standard deviation over time (over the second dimension)


%%  Visualizing a time point 

time_point = randi([1,size(average_voxel,2)],1); % Choosing an arbitrary time point
disp(time_point)
onetimepoint = average_voxel(:,time_point);
onetimepoint = onetimepoint(imglookup); % Variable imglookup was contained in the data file that helps visualize the data by creating a 2D image of the 3D spatial position of voxels
onetimepoint(extrapmask) = nan; % Variable extrapmask is a matrix of 1s and 0s that helps distinguish the cortex from the redundant boundary

figure(1), clf
set(gcf,'color','w');
colormap(jet) % Better visualization through contrasting colors
subplot(2,1,1)
imagesc(onetimepoint) % Flatmap of the cortex at the arbitrary time point
title(['Flatmap at time point ',num2str(time_point)])
xlabel('x direction voxels')
ylabel('y direction voxels')
a = colorbar;
a.Label.String = 'Voxel activity/"noise"';
set(gca,'FontSize',16)
savefig('Onetimepointmap.fig')

%% Visualizing a standard deviation map 

stdmap = stdmap(imglookup); % Variable imglookup was contained in the data file that helps visualize the data by creating a 2D image of the 3D spatial position of voxels
stdmap(extrapmask) = nan; % Variable extrapmask is a matrix of 1s and 0s that helps distinguish the cortex from the redundant boundary
subplot(2,1,2)
imagesc(stdmap) % Standard deviation map 
title('Standard deviation map')
xlabel('x direction voxels')
ylabel('y direction voxels')
set(gca,'clim',[0 100]) % Adding colorbar limit to compare standard deviation map and cortex flatmap 
b = colorbar;
b.Label.String = 'Voxel variability';
set(gca,'FontSize',16)
savefig('stdmap.fig')

%% Plotting BOLD signal intensity over time for an arbitrary voxel

random_voxel = randi([1,size(average_voxel,1)],1);
time = (0:size(average_voxel,2)-1) / (1/tr); % 1/tr is the sampling rate to convert from time points to seconds

figure(2), clf
set(gcf,'color','w');
plot(time,average_voxel(random_voxel,:),'k','LineWidth',2)
title(['BOLD time course from voxel #',num2str(random_voxel)])
xlabel('Time (s)')
ylabel('BOLD signal intensity (a.u)')
hold on

[f1, gof1] = fit(time',average_voxel(random_voxel,:)','poly1'); % Best fit line for BOLD signal data 
plot(time,f1(time),'LineWidth',2)
legend('BOLD signal variation','Trend line')
set(gca,'FontSize',16)
disp(f1)

%% Writing fit data into a file project.dat

fid = fopen('project.dat','w');
x = f1.p1;
y = f1.p2;
z = gof1.rsquare;
if x < 0 % if-else statement that analyzes the trend and predicts whether BOLD signal intensity roughly increases or decreases with time for that arbitrary voxel
    fprintf(fid, "BOLD signal intensity decreases (on average) with time for voxel #%i\n", random_voxel);
else 
    fprintf(fid, "BOLD signal intensity increases (on average) with time for voxel #%i\n", random_voxel);
end
fprintf(fid,"The fit parameters are %0.2f and %0.2f\n", x, y);
fprintf(fid,"The goodness of fit r squared value is %0.2f\n",z);
fprintf(fid,"Note: This data is only for one particular voxel point that is chosen at random\n");
fclose(fid);


% f = [];
% gof = [];
% for i = 1:size(data{1},1)
%    [f1, gofl] = fit(time',data{1}(i,:)','poly1');
%    f = [f f1.p1];
%    gof = [gof gofl.rsquare];
% end

% The for loop above calculates the fit parameters and goodness of fit r squared value for all voxels (approximately 122,000 voxels). The command was taking a long time to run because of the massive data size, so the code is commented out. It helps understand superficially, that some voxels increase activity and others decrease activity over time. But what is important is which voxels increase activity for the corresponding visual stimulus onset. That is visualized in the animation. 


%% Rendering event/condition-related BOLD response graphs to distinguish the 6 visual eccentricity conditions

figure(3), clf, hold on
set(gcf,'color','w');
plot(average_voxel(random_voxel,:),'k','LineWidth',2) % BOLD signal intensity over time plot (as shown in previous segment)
set(gca,'FontSize',16)
condition_onsets = find(design{1}(:,1)); % Finding condition onset times (when the visual stimulus was shown) for trial 1 for condition 1
for i = 1 : length(condition_onsets)
    plot([1 1]*condition_onsets(i),get(gca,'ylim'),'m--')
end

xlabel('Time (s)')
ylabel('BOLD signal intensity (a.u)')
legend({'BOLD signal variation','Event 1'})
% These graphs can be made for each condition but that will not help in an adequate analysis. Therefore, the following animation will help visualize the changes in the visual cortex for each different condition/visual eccentricity introduced.

%% Creating an animation to better visualize retinotopy and the eccentricity effect 

clear
load('exampledataset.mat')
numvoxels = size(((data{1}+data{2}+data{3}+data{4})/4),1); % Creating variables from scratch to refresh MATLAB

timebounds = [ -2 15 ];
timevec = timebounds(1):timebounds(2);
erBOLD = zeros(6,numvoxels,length(timevec)); % Inializing event-related BOLD matrix (condition X voxels X time)

for condi = 1:6 % Loop over 6 conditions of visual stimuli
    for runi = 1:4 % Loop over trials 1-4
        events = find(design{runi}(:,condi));
        tmp = zeros(numvoxels,length(timevec)); % Extracting peri-event time series in a temporary variable tmp
            for ei = 1:length(events)
                tmp = tmp + data{runi}(:,events(ei)+timebounds(1):events(ei)+timebounds(2));
            end
        erBOLD(condi,:,:) = squeeze(erBOLD(condi,:,:)) + tmp/ei; % Adding the trial-averaged event to the matrix (3D matrix is squeezed to a 2D matrix)
    end
end

erBOLD = erBOLD/runi; % Calculating the mean

[Y,X] = meshgrid(linspace(-4,4,21)); % Making a Gaussian for the spatial smoothing (arbitrary and hand-selected size and width)
G = exp(-(X.^2+Y.^2)/10);
G = G./sum(G(:)); % Normalizing the Gaussian

figure(4), clf
set(gcf,'color','w');
t = tiledlayout(2,3,'TileSpacing','Compact'); % Using tiledlayout to create a 2x3 grid of subplots

for condi = 1:6
    nexttile % Goes to the next tile (next subplot)
    imh(condi) = imagesc(randn(size(imglookup))); % Creating an image 
    %set(gca,'clim',[-1 1]*3)
    axis off, axis image
    title(['Condition ',num2str(condi)])
    set(gca,'fontsize',14)
end


for timei = 1:size(erBOLD,3)
    for condi = 1:6 % Loop over conditions
        timepointmap = squeeze(erBOLD(condi,:,timei)); % Extracting a time point map 
        timepointmap = timepointmap(imglookup);
        timepointmap = conv2(timepointmap,G,'same'); % Smoothing with the Gaussian
        timepointmap(extrapmask) = NaN;
        set(imh(condi),'CData',timepointmap) % Setting data specifications
    end % End of condition loop
    %set(get(t,'Title'),'String',[ 'Brain maps at time ' num2str(timevec(timei)) ' s.' ])
    colormap('jet')
    pause(.2) % Pause to allow MATLAB to update, and the viewers to absorb the information

end



