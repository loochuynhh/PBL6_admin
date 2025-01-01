import { Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import axiosInstance from "axiosConfig";
import NotificationModal from "components/modal/NotificationModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [notifyState, setNotifyState] = useState({
        type: false,
        isOpen: false,
        message: ''
    });
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            await axiosInstance.put(`/api/forgot-password/${username}`);

            setNotifyState({
                type: true,
                isOpen: true,
                message: 'Your password has been reset and sent to your email. Please check your email.'
            });
        }
        catch (error) {
            console.error("Error API forgot password", error);

            setNotifyState({
                type: false,
                isOpen: true,
                message: "Username not exist !!!"
            });
        }
        finally {
            setLoading(false);
        }
    }

    const handleBackToLogin = () => {
        navigate('/auth/sign-in');
    }

    return ( 
        <Flex h="100vh" direction="column" align="center" justifyContent="space-around">
            <Text
                fontSize="5xl"
                fontFamily="heading"
                fontWeight="bold"
            >
                Forgot Password
            </Text>
            <Flex w={"40%"} justifyContent="space-between" alignItems="center" >
                <Flex w='65%' justifyContent="space-between" alignItems="center">
                    <Text fontSize="xl" m="0 auto" mr="1rem">Username:</Text>
                    <Input 
                        type="text"
                        placeholder="Enter your username"
                        ml="1rem"
                        border="1px solid #ccc"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Flex>
                <Button
                    colorScheme="green"
                    onClick={handleForgotPassword}
                >
                    {loading 
                        ? <>Please wait <Spinner size="sm" color="white" ml=".5rem" /></> 
                        : 'Get new password'
                    }
                </Button>
            </Flex>
            
            <Button
                colorScheme="blue"
                onClick={handleBackToLogin}
            >
                Back to log in
            </Button>

            <NotificationModal
                isOpen={notifyState.isOpen}
                onClose={() => setNotifyState({ ...notifyState, isOpen: false })}
                message={notifyState.message}
                isSuccess={notifyState.type}
            />
        </Flex>
    );
}
 
export default Forgot;