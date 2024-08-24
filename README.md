# Most Popular Dog Breeds - American Kennel Club

![Application Screenshot](/images/main-page.png)

## Overview

This project is an analytics application designed to predict and display the popularity of dog breeds. The app fetches data from a backend service and displays it on a user-friendly web interface.

## Features

- **ML Predictions:** Utilizes GCP BigQueryML for predicting dog breed popularity.
- **Data Storage:** Data is stored in GCP (Google Cloud Storage and BigQuery).
- **Monitoring & Alerts:** Implemented using Google Cloud Monitoring.
- **Continuous Deployment:** Integrated with GitHub Actions.
- **Cloud Deployment:** Deployed on Google Kubernetes Engine (GKE).
- **Backend:** Go with RESTful APIs for data retrieval.
- **Frontend:** Developed using React to present a responsive and user-friendly interface.

## How to Use

- **URL:** [http://104.154.18.149/](http://104.154.18.149/)
- Access the application to view dog breed rankings by year and future predictions.

## Technical Stack

- **Frontend:** React.js
- **Backend:** Go with RESTful APIs
- **Machine Learning:** BigQueryML
- **Deployment:** GKE on GCP
- **CI/CD:** GitHub Actions
- **Monitoring:** Google Cloud Monitoring

## Setup

1. Clone the repository.
2. Configure GCP services as per the documentation.
3. Use GitHub Actions for continuous deployment.