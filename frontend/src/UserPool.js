import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    // UserPoolId: "ap-southeast-1_Vdgt9wJ8f",
    // ClientId :"2l3jd0d1r5fjabbb6v1s1fmboj",
    UserPoolId: "ap-southeast-1_JRGYVJchl",
    ClientId :"21r8c8nc7b17o31umvlv5m10nc",
}


export default new CognitoUserPool(poolData);