import { View, Text, Modal, Button } from 'react-native';
import React, { useState } from 'react';

export default function CustomAlert({ visible, title, subtitle, onOk, onCancel }: any) {
  const [isVisible, setIsVisible] = useState(visible);

  const handleOk = () => {
    onOk();
    setIsVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
          <Text style={{ marginBottom: 20 }}>{subtitle}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button title="OK" onPress={handleOk} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
