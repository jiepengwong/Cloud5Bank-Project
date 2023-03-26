import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-southeast-1_uldoanBJO",
    ClientId :"37a0vvvi834aa5i8sua1h75ptl",
}
const pool_region = 'ap-southeast-1';


export default new CognitoUserPool(poolData);