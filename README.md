# Cloud5Bank Project

## Introduction
**Cloud5Bank** is an innovative online digital bank application developed as part of our CME class project. Our primary objective was to create a secure, user-friendly platform that effectively addresses the challenges faced by online banking services. Through this project, we aimed to provide customers with an exceptional and secure digital banking experience while prioritizing operational excellence.

## Business Problems

### Security Concerns
In the online banking industry, one of the most pressing issues is the security of financial data. Customers often express reluctance to use online banking services due to concerns about the safety of their sensitive information. Cloud5Bank has been developed with robust security measures to alleviate these concerns and build trust among our users.

### Service Downtime
Frequent instances of service downtime during periods of high traffic have been a significant pain point in the online banking sector. These outages not only frustrate customers but also hinder their ability to carry out essential transactions. Cloud5Bank addresses this challenge by focusing on scalability and reliability, ensuring that our services remain available even during peak usage.

### Slow System Response
The sluggish response times experienced by customers when accessing various features on the bank's website have contributed to a high rate of customer churn. Cloud5Bank takes this matter seriously and has optimized its system for quick and seamless interactions, enhancing the overall user experience and reducing customer attrition.

## Business Goals

Cloud5Bank is dedicated to achieving the following core objectives:

### Security and Data Protection
We prioritize safeguarding customer data by implementing cutting-edge security measures. Compliance with industry regulations and data protection laws ensures the utmost confidentiality and integrity of user information, thereby building trust and confidence in our platform.

### Scalability and Reliability
To address the challenge of service downtime, Cloud5Bank has been architectured to be highly scalable and reliable. This enables us to handle increased traffic without compromising system performance, ensuring a consistent and uninterrupted banking experience for our customers.

### User Experience and Operational Excellence
We understand the importance of a seamless user experience. Cloud5Bank has been designed with a user-friendly interface to provide an exceptional banking journey. Furthermore, we are committed to operational excellence by maintaining efficient processes, promptly addressing issues, and continuously improving our services.

## Requirements

### Business Requirements

#### Data Protection & Security
The security of customer data is a non-negotiable aspect of Cloud5Bank. Advanced security protocols, encryption mechanisms, and strict access controls are implemented to safeguard sensitive information from unauthorized access or breaches.

#### Regulatory Compliance
We uphold the highest standards of regulatory compliance in the financial industry. Cloud5Bank adheres to relevant financial regulations and data protection laws, ensuring that our platform meets industry standards and legal requirements.

#### Customer Satisfaction
Addressing service downtime and enhancing system responsiveness are central to boosting customer satisfaction. By minimizing disruptions and improving overall performance, we aim to exceed customer expectations.

#### Minimal Downtime & Fast Response
Cloud5Bank's architecture and infrastructure have been optimized to minimize service downtime, especially during peak usage periods. Quick response times to user interactions contribute to a smoother and more efficient banking experience.

### Operational Requirements

#### Cost & Operational Efficiency
To ensure cost-effective operations, Cloud5Bank focuses on efficient resource allocation and budget-conscious solutions. This approach maximizes value while minimizing expenses.

#### Maintenance Policy & Monitoring
Our proactive approach to maintenance involves establishing a comprehensive policy and monitoring system. This enables us to promptly identify and rectify any issues, ensuring that our services remain reliable and uninterrupted.

## Use Case 1: Account Management (Customer Actions)

- **Signing up for a new account:** Customers can easily create new accounts through a straightforward registration process.
- **Requesting bank activation:** A seamless activation request process enables customers to quickly start using their new accounts.
- **Logging into an existing account:** Secure login mechanisms ensure that customers can access their accounts conveniently and safely.
- **Depositing, withdrawing, and transferring money:** Cloud5Bank provides a range of financial transaction options to facilitate money management.
- **Viewing transaction history:** Customers can review their transaction history to stay informed about their financial activities.

## Use Case 2: Account Management (Admin Actions)

- **Approving new accounts:** Administrators can efficiently review and approve new account requests, ensuring a smooth onboarding process.
- **Declining new accounts:** In cases where additional verification is required, administrators can decline account requests as needed.
- **Deactivating inactive accounts:** To maintain security and streamline operations, administrators have the ability to deactivate accounts that show prolonged inactivity.
- **Viewing transaction history:** Administrators can access transaction history to monitor financial activities and ensure compliance with regulations.
- **Monitoring suspicious transaction activity:** Detecting and addressing suspicious transactions is crucial. Admins can monitor and take appropriate actions to mitigate potential risks.

## Architecture Diagrams

Throughout the development of Cloud5Bank, two architectural diagrams were created: a proposed architecture and an implemented architecture. Due to time constraints and considerations around costs, certain modifications and omissions were made.

Some notable decisions include:

- **Private vs. Subnet:** To optimize costs, private subnets were chosen over implementing a more expensive NAT gateway solution.
- **ALBs Usage:** In addressing challenges with inter-container communication, Application Load Balancers (ALBs) were employed as an alternative to service discovery mechanisms.
- **Exclusion of Services:** To maintain project completion and cost-effectiveness, services like Glue and DynamoDB streams were omitted.

For more in-depth insights into the decision-making process and detailed AWS configurations, refer to our comprehensive report available in our repository.

*Note: You can find the detailed architecture diagrams and decision rationale in the project repository.*

For additional information, consult our detailed report, which provides an extensive breakdown of our decision-making process and the specific AWS configurations we implemented.
