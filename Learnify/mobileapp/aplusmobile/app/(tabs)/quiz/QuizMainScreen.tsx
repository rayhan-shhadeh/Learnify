import React, { useState, useEffect } from 'react';
import { Alert,View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import API from '../../../api/axois';
export default function QuizMainScreen() {
    const router = useRouter();
    const [isCourseModalVisible, setCourseModalVisible] = useState(false);
    const [isFileModalVisible, setFileModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [files, setFiles] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'Token not found');
                    router.push('/(tabs)/auth/signin');
                    return;
                }
                const decoded: { id: string } | null = jwtDecode<{ id: string }>(token);
                setUserId(decoded?.id ?? null);
                const response = await API.get(`/api/user/courses/${decoded?.id}`);
                if (response.status !== 200) {
                    Alert.alert('Error', 'Failed to fetch courses');
                    return;
                }
                const data = response.data;
                const mappedCourses = data.map((course: any) => ({
                    id: course.courseId,
                    name: course.courseName,
                    description: course.courseDescription,
                    tag: course.courseTag,
                }));
                setCourses(mappedCourses);
            } catch (error) {
                Alert.alert('Error', 'An error occurred while fetching courses');
            }
        };
        fetchCourses();
    }, []);

    const toggleFileSelection = (fileId: string) => {
        setSelectedFile(selectedFile === fileId ? null : fileId);
    };

    const renderCourseItem = ({ item }: { item: { id: string; name: string } }) => (
        <TouchableOpacity style={styles.courseItem} onPress={() => handleCourseSelection(item)}>
            <Text style={styles.courseText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const handleCourseSelection = async (course: { id: string; name: string }) => {
        try {
            setSelectedCourse(course.name);
            setCourseModalVisible(false);
            const response = await API.get(`/api/user/course/files/${course.id}`);
            if (response.status === 200) {
                const data = response.data;
                if (Array.isArray(data)) {
                    const mappedFiles = data.map((file: any) => ({
                        id: file.fileId,
                        name: file.fileName,
                    }));
                    setFiles(mappedFiles);
                } else {
                    Alert.alert('Error', 'Invalid response format.');
                }
            } else {
                Alert.alert('Error', 'Failed to fetch files for the selected course.');
            }
            setFileModalVisible(true);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching files for the selected course.');
        }
    };

    const renderFileItem = ({ item }: { item: { id: string; name: string } }) => (
        <TouchableOpacity
            style={[styles.fileItem, selectedFile === item.id && styles.fileItemSelected]}
            onPress={() => toggleFileSelection(item.id)}
        >
            <Text style={styles.fileText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderCourseModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={isCourseModalVisible}
            onRequestClose={() => setCourseModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Icon name="close" size={24} color="#333" onPress={() => setCourseModalVisible(false)} />
                    <Text style={styles.modalTitle}>Select a Course</Text>
                    <FlatList
                        data={courses}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCourseItem}
                    />
                </View>
            </View>
        </Modal>
    );
    const renderFileModal = () => (
        <Modal
            animationType="slide"
            transparent
            visible={isFileModalVisible}
            onRequestClose={() => setFileModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Icon name="close" size={24} color="#333" onPress={() => setFileModalVisible(false)} />
                    <Text style={styles.modalTitle}>Select File from {selectedCourse}</Text>
                    <FlatList
                        data={files}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderFileItem}
                    />
                    <TouchableOpacity
                        style={[styles.modalButton]}
                        onPress={() => {
                            if (selectedFile) {
                                console.log("Selected file ID:", selectedFile);
                                const passedFileId = selectedFile ;
                                const passedIsFromAllFilesPage ="home";
                                router.push({
                                    pathname: '/(tabs)/quiz/Quiz',
                                    params: {passedFileId,passedIsFromAllFilesPage},
                                })
                            } else {
                                Alert.alert("No File Selected", "Please select a file.");
                            }
                            setFileModalVisible(false);
                        }}
                    >
                        <Text style={styles.modalButtonText}>Confirm Selection</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
    return (
        <LinearGradient colors={['#c1e8ff', '#ffff', '#1CA7EC']} style={styles.linearcontainer}>
            <View style={styles.container}>
                <Image source={require('../../../assets/quiz-unscreen.gif')} style={styles.icon} />
                <TouchableOpacity style={styles.button} onPress={() => setCourseModalVisible(true)}>
                    <Text style={styles.buttonText}>Start New Quiz</Text>
                    <Icon name="plus" size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.quizhistory}>
                    <Text style={styles.cardText}>Quiz History</Text>
                    <Icon name="history" size={25} color="#1CA7EC" />
                </TouchableOpacity>
            </View>
            {renderCourseModal()}
            {renderFileModal()}
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    button: {
        backgroundColor: '#1CA7EC',
        padding: 10,
        borderRadius: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBlock: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    card: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    cardText: {
        fontSize: 20,
        marginRight: 10,
    },
    linearcontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quizhistory: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 40,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    icon: {
        width: 100,
        height: 200,
        borderRadius: 20,
        margin: 10,
        flex: 1,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    fileList: {
        maxHeight: 200,
        marginBottom: 15,
    },
    fileItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    fileItemSelected: {
        backgroundColor: "#e0f7fa",
    },
    fileText: {
        fontSize: 16,
        color: "#333",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        padding: 20,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: "center",
    },
    addButton: {
        backgroundColor: "#2196F3",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    courseItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#f0f8ff",
        borderRadius: 10,
        alignItems: "center",
    },
    courseText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
    },
});
