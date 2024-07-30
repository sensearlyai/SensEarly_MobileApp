import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const ToastMessage = ({ visible, message, onClose, type }: any) => {
    const [modalVisible, setModalVisible] = useState(visible);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // Explicitly type timeoutId

    useEffect(() => {
        setModalVisible(visible);
        if (visible) {
            const newTimeoutId = setTimeout(() => {
                setModalVisible(false);
                onClose(); // Close the modal when requested
            }, 1000); // Auto-hide after 3 seconds
            setTimeoutId(newTimeoutId); // Store the timeout ID
        } else {
            if (timeoutId) {
                clearTimeout(timeoutId); // Clear the timeout if the modal becomes invisible
            }
        }
    }, [visible]);

    const handleOnClose = () => {
        setModalVisible(false);
        onClose(); // Close the modal when requested
        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the timeout
        }
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                onClose(); // Close the modal when requested
                if (timeoutId) {
                    clearTimeout(timeoutId); // Clear the timeout
                }
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: type === 'success' ? '#17A948' : '#E05858', borderRadius: 10 }}>
                        <View style={{ marginHorizontal: 16, width: '15%' }}>
                            {type === 'success' ?
                                <FontAwesomeIcon icon={faCheckCircle} size={35} color="white" />
                                : <FontAwesomeIcon icon={faTriangleExclamation} size={35} color="white" />
                            }
                        </View>
                        <View style={{ width: '85%' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{type === 'success' ? 'Success' : 'Error'}</Text>
                            <Text style={{ fontSize: 14, color: 'white' }}>{message}</Text>
                        </View>
                        {/* X mark */}
                        <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }} onPress={handleOnClose}>
                            <FontAwesomeIcon icon={faTimes} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    },
    modalView: {
        marginHorizontal: 10,
        backgroundColor: 'transparent', // Transparent background for the modal view
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        // elevation: 5,
    },
});

export default ToastMessage;
