# Dog Breed Popularity Prediction and Ranking

## Overview

This project is an analytics application designed to predict and rank the popularity of dog breeds in the U.S. It leverages a machine learning model to make predictions and provides a user-friendly interface for viewing historical rankings and future predictions.

(Data Source: Dog Breeds dataset from American Kennel Club)[https://www.kaggle.com/datasets/sujaykapadnis/dog-breeds]

## Features

- **Source Code**: The entire source code is stored in a GitHub repository, enabling easy collaboration and version control.
- **Continuous Deployment**: Implemented using GitHub Actions for automated testing, building, and deployment of the application.
- **Data Storage**: Data is stored in Google Cloud Storage and BigQuery for scalability and performance.
- **ML Predictions**: Predictions are generated using Google BigQuery ML, which is integrated into the application.
- **Monitoring**: The application is monitored using Cloud Monitoring of GCP for real-time performance insights and alerting.
- **Deployment**: The application is deployed on Google Kubernetes Engine (GKE), serving HTTP requests via a REST API that returns JSON payloads.

## Architecture

1. **Backend**: 
   - Built with Go and deployed on GKE.
   - Provides REST API endpoints for ML predictions and historical data.

2. **Frontend**:
   - Developed with React, offering an interactive UI for users to explore dog breed popularity data.
   - Deployed on GKE.

3. **Machine Learning**:
   - BigQuery ML is used to train and serve the prediction model, predicting future dog breed popularity.

4. **Data Storage**:
   - Historical and prediction data is stored in BigQuery and Google Cloud Storage.

5. **Continuous Deployment**:
   - GitHub Actions automates the process of testing, building Docker images, and deploying to GKE.

6. **Monitoring**:
   - Prometheus and Grafana are used to monitor application health and performance.


## Monitoring and Alerts

- The application is monitored using Prometheus and Grafana.
- Alerts are set up for critical metrics to ensure high availability and performance.

## Acknowledgements

- **Google Cloud** for providing the infrastructure and tools used in this project.
- **GitHub Actions** for continuous integration and deployment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
