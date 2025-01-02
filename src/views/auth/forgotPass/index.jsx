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
        } catch (error) {
            console.error("Error API forgot password", error);

            setNotifyState({
                type: false,
                isOpen: true,
                message: "Username not exist !!!"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/auth/sign-in');
    };

    return (
        <Flex h="100vh" direction="column" align="center" justify="center" bg="gray.50" p={4}>
            <Flex direction="column" bg="white" shadow="xl" rounded="lg" p={8} w="full" maxW="lg">
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    color="blue.600"
                    mb={6}
                >
                    Forgot Password
                </Text>
                <Flex direction="column" mb={4}>
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Username</Text>
                    <Input
                        type="text"
                        placeholder="Enter your username"
                        variant="outline"
                        borderColor="gray.300"
                        focusBorderColor="blue.500"
                        size="lg"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Flex>
                <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    mb={4}
                    onClick={handleForgotPassword}
                    isLoading={loading}
                    loadingText="Processing"
                >
                    Get New Password
                </Button>
                <Button
                    colorScheme="gray"
                    variant="outline"
                    size="lg"
                    w="full"
                    onClick={handleBackToLogin}
                >
                    Back to Login
                </Button>
            </Flex>

            <NotificationModal
                isOpen={notifyState.isOpen}
                onClose={() => setNotifyState({ ...notifyState, isOpen: false })}
                message={notifyState.message}
                isSuccess={notifyState.type}
            />
        </Flex>
    );
};

export default Forgot;
