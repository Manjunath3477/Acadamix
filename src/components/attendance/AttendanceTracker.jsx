import React, { useState, useEffect } from 'react';
import { QrCodeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MapPinIcon, CameraIcon } from '../icons/Icons';

const AttendanceTracker = ({ courseId, userRole, userId }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [qrCode, setQrCode] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [location, setLocation] = useState(null);
    const [showQRScanner, setShowQRScanner] = useState(false);

    // Mock data
    useEffect(() => {
        const mockHistory = [
            {
                id: 1,
                date: '2025-09-08',
                session: 'React Hooks - Advanced Patterns',
                status: 'present',
                checkInTime: '09:15:23',
                location: 'Room 304',
                duration: '2h 15m'
            },
            {
                id: 2,
                date: '2025-09-06',
                session: 'State Management with Redux',
                status: 'late',
                checkInTime: '09:22:45',
                location: 'Room 304',
                duration: '2h 8m'
            },
            {
                id: 3,
                date: '2025-09-04',
                session: 'Component Lifecycle Methods',
                status: 'absent',
                checkInTime: null,
                location: 'Room 304',
                duration: null
            },
            {
                id: 4,
                date: '2025-09-02',
                session: 'Introduction to React',
                status: 'present',
                checkInTime: '09:12:10',
                location: 'Room 304',
                duration: '2h 18m'
            }
        ];

        setAttendanceHistory(mockHistory);

        // Mock current session for faculty
        if (userRole === 'faculty') {
            setCurrentSession({
                id: 'session-' + Date.now(),
                title: 'Advanced React Patterns',
                startTime: new Date().toISOString(),
                location: 'Room 304',
                expectedStudents: 45,
                checkedIn: 0
            });
            generateQRCode();
        }
    }, [courseId, userRole]);

    const generateQRCode = () => {
        const sessionData = {
            courseId,
            sessionId: 'session-' + Date.now(),
            timestamp: Date.now(),
            location: 'Room 304'
        };
        setQrCode(btoa(JSON.stringify(sessionData)));
    };

    const startAttendanceSession = () => {
        const newSession = {
            id: 'session-' + Date.now(),
            title: document.getElementById('sessionTitle').value,
            startTime: new Date().toISOString(),
            location: document.getElementById('sessionLocation').value,
            expectedStudents: 45,
            checkedIn: 0
        };
        setCurrentSession(newSession);
        generateQRCode();
    };

    const endAttendanceSession = () => {
        setCurrentSession(null);
        setQrCode('');
    };

    const handleQRScan = (data) => {
        try {
            const sessionData = JSON.parse(atob(data));
            
            // Verify location
            if (location && sessionData.location !== location.building) {
                setScanResult({
                    success: false,
                    message: 'Location mismatch. Please ensure you are in the correct classroom.'
                });
                return;
            }

            // Mark attendance
            const attendance = {
                studentId: userId,
                sessionId: sessionData.sessionId,
                checkInTime: new Date().toISOString(),
                location: sessionData.location,
                status: 'present'
            };

            setScanResult({
                success: true,
                message: 'Attendance marked successfully!',
                details: attendance
            });

            // Add to history
            const newRecord = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                session: 'Current Session',
                status: 'present',
                checkInTime: new Date().toLocaleTimeString(),
                location: sessionData.location,
                duration: 'In Progress'
            };

            setAttendanceHistory(prev => [newRecord, ...prev]);
        } catch (error) {
            setScanResult({
                success: false,
                message: 'Invalid QR code. Please try again.'
            });
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        building: 'Main Campus - Building A' // Mock building detection
                    });
                },
                (error) => {
                    console.error('Location error:', error);
                    setLocation({ error: 'Location access denied' });
                }
            );
        }
    };

    const AttendanceStats = () => {
        const totalSessions = attendanceHistory.length;
        const presentCount = attendanceHistory.filter(a => a.status === 'present').length;
        const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
        const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;
        const attendanceRate = totalSessions > 0 ? ((presentCount + lateCount) / totalSessions * 100).toFixed(1) : 0;

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl">
                    <div className="text-2xl font-bold">{attendanceRate}%</div>
                    <div className="text-sm opacity-90">Attendance Rate</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-soft border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-soft border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                    <div className="text-sm text-gray-600">Late</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-soft border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                </div>
            </div>
        );
    };

    const QRCodeDisplay = () => (
        <div className="bg-white rounded-2xl p-6 shadow-large text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Session QR Code</h3>
            
            {currentSession ? (
                <div>
                    <div className="mb-4">
                        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                            <div className="text-center">
                                <QrCodeIcon className="h-24 w-24 text-gray-400 mx-auto mb-2" />
                                <div className="text-xs text-gray-500 font-mono break-all px-4">
                                    {qrCode.substring(0, 20)}...
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Students scan this code to mark attendance</p>
                        <div className="text-xs text-gray-500">
                            <div>Session: {currentSession.title}</div>
                            <div>Location: {currentSession.location}</div>
                            <div>Started: {new Date(currentSession.startTime).toLocaleTimeString()}</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{currentSession.checkedIn}</div>
                            <div className="text-sm text-blue-800">Checked In</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-gray-600">{currentSession.expectedStudents}</div>
                            <div className="text-sm text-gray-800">Expected</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={endAttendanceSession}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        End Session
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-500 mb-4">No active attendance session</p>
                    
                    <div className="space-y-3">
                        <input
                            id="sessionTitle"
                            type="text"
                            placeholder="Session Title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            id="sessionLocation"
                            type="text"
                            placeholder="Location (e.g., Room 304)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button
                        onClick={startAttendanceSession}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Start Attendance Session
                    </button>
                </div>
            )}
        </div>
    );

    const QRScanner = () => (
        <div className="bg-white rounded-2xl p-6 shadow-large">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mark Attendance</h3>
            
            {!showQRScanner ? (
                <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Camera Scanner</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                getLocation();
                                setShowQRScanner(true);
                            }}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <QrCodeIcon className="h-5 w-5 inline mr-2" />
                            Scan QR Code
                        </button>
                        
                        <div className="text-center">
                            <input
                                type="text"
                                placeholder="Or enter QR code manually"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value) {
                                        handleQRScan(e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    
                    {location && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center justify-center space-x-2 text-blue-700">
                                <MapPinIcon className="h-4 w-4" />
                                <span className="text-sm">{location.building || 'Location detected'}</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-900 rounded-xl flex items-center justify-center">
                        <div className="text-white text-center">
                            <div className="border-2 border-white w-32 h-32 mx-auto mb-2 rounded-lg flex items-center justify-center">
                                <QrCodeIcon className="h-16 w-16" />
                            </div>
                            <p className="text-sm">Scanning for QR code...</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                // Simulate QR scan for demo
                                const mockQRData = btoa(JSON.stringify({
                                    courseId: 'course-123',
                                    sessionId: 'session-456',
                                    timestamp: Date.now(),
                                    location: 'Room 304'
                                }));
                                handleQRScan(mockQRData);
                                setShowQRScanner(false);
                            }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Simulate Scan (Demo)
                        </button>
                        
                        <button
                            onClick={() => setShowQRScanner(false)}
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            
            {scanResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                    scanResult.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                }`}>
                    <div className="flex items-center space-x-2">
                        {scanResult.success ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                            scanResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {scanResult.message}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Tracking</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {userRole === 'student' && <AttendanceStats />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userRole === 'faculty' ? <QRCodeDisplay /> : <QRScanner />}
                
                {/* Attendance History */}
                <div className="bg-white rounded-2xl p-6 shadow-large">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance History</h3>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {attendanceHistory.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        record.status === 'present' ? 'bg-green-500' :
                                        record.status === 'late' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}></div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">{record.session}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{record.date}</span>
                                            {record.checkInTime && (
                                                <>
                                                    <span>•</span>
                                                    <span>Checked in: {record.checkInTime}</span>
                                                </>
                                            )}
                                            <span>•</span>
                                            <span>{record.location}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    {record.duration && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {record.duration}
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTracker;
