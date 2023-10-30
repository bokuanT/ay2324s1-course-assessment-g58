import { useAuth } from "@/contexts/AuthContext";
import { useMatching } from "@/contexts/MatchingContext";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import CollabPageNavigation from "./CollabPageQuestion/CollabPageNavigation";
import QuestionPanel from "./CollabPageQuestion/QuestionPanel";
import InterviewerView from "./InterviewerView";
import {
    Container,
    Box,
    Button,
    Paper,
    TextareaAutosize,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Grid,
} from "@mui/material";
import CodeEditor from "./CodeEditor";
import { LANGUAGE } from "@/utils/enums";
import SimpleSnackbar from "./RejectQuestionSnackBar";
import RejectEndSessionSnackBar from "./RejectEndSessionSnackBar";
import EndingSessionBackdrop from "./EndingSessionBackDrop";

const CollabPage = () => {
    const { userId, language, roomId, cancelMatching, questions } =
        useMatching();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket>();
    const [questionNumber, setQuestionNumber] = useState(0);
    const [isNextQnHandshakeOpen, setIsNextQnHandshakeOpen] = useState(false);
    const [iHaveAcceptedNextQn, setIHaveAcceptedNextQn] = useState(false);
    const [isInterviewer, setInterviewer] = useState<boolean>();
    const [isInterviewerChosen, setInterviewerChosen] =
        useState<boolean>(false);
    const [isIntervieweeChosen, setIntervieweeChosen] =
        useState<boolean>(false);
    const [showInterviewerView, setShowInterviewerView] = useState(false);
    const [showDialog, setShowDialog] = useState(true);
    const [snackBarIsOpen, setSnackBarIsOpen] = useState(false);
    const [isEndingSession, setIsEndingSession] = useState(false); // If this is true, end session procedure starts (see useEffect)
    const [isEndSessionHandshakeOpen, setIsEndSessionHandshakeOpen] = useState(false);
    const [iHaveAcceptedEndSession, setIHaveAcceptedEndSession] = useState(false);
    const [endSessionSnackBarIsOpen, setEndSessionSnackBarIsOpen] = useState(false);
    const toggleInterviewerView = () => {
        setShowInterviewerView(!showInterviewerView);
    };
    const startRoleChange = () => {
        socket?.emit("roleSwitch");
        console.log("role switch");
    };
    const changeRole = () => {
        setInterviewer(!isInterviewer);
        if (showInterviewerView) {
            setShowInterviewerView(false);
        }
    };

    const handleClosePickRole = (event: any, reason: string) => {
        if (reason && reason == "backdropClick")
            return; /* This prevents modal from closing on an external click */

        if (reason && reason == "escapeKeyDown") return; //prevent user from closing dialog using esacpe button
        setShowDialog(false);
    };

    const handleSnackbarClose = () => {
        setSnackBarIsOpen(false);
    };

    const handleEndSessionSnackbarClose = () => {
        setEndSessionSnackBarIsOpen(false);
    };

    const questionPanelProps = {
        question_number: questionNumber + 1,
        question: questions[questionNumber],
    };

    // Called when Next question button is pressed by this user
    const handleNextQuestion = () => {
        socket?.emit("openNextQuestionPrompt");
    };

    // Called when this user accepts next question prompt
    const handleIPressedAccept = () => {
        setIHaveAcceptedNextQn(true);
        socket?.emit("aUserHasAcceptedNextQuestionPrompt");
    };

    // Called when this user rejects next question prompt
    const handleIPressedReject = () => {
        setIHaveAcceptedNextQn(false);
        socket?.emit("aUserHasRejectedNextQuestionPrompt");
    };

    // Called when user tries to end session
    const handleEndSession = () => {
        socket?.emit("openEndSessionPrompt");
    };

    // Called when this user accepts end session prompt
    const handleIPressedAcceptEndSession = () => {
        setIHaveAcceptedEndSession(true);
        socket?.emit("aUserHasAcceptedEndSessionPrompt");
    };

    // Called when this user rejects end session prompt
    const handleIPressedRejectEndSession = () => {
        setIHaveAcceptedEndSession(false);
        socket?.emit("aUserHasRejectedEndSessionPrompt");
    };

    const collabPageNavigationProps = {
        handleNextQuestion: handleNextQuestion,
        isNextQnHandshakeOpen: isNextQnHandshakeOpen,
        setIsNextQnHandshakeOpen: setIsNextQnHandshakeOpen,
        handleIPressedAccept: handleIPressedAccept,
        handleIPressedReject: handleIPressedReject,
        iHaveAcceptedNextQn: iHaveAcceptedNextQn,
        toggleInterviewerView: toggleInterviewerView,
        showInterviewerView: showInterviewerView,
        isInterviewer: isInterviewer,
        startRoleChange: startRoleChange,
        handleEndSession: handleEndSession,
        isEndSessionHandshakeOpen: isEndSessionHandshakeOpen,
        setIsEndSessionHandshakeOpen: setIsEndSessionHandshakeOpen,
        handleIPressedAcceptEndSession: handleIPressedAcceptEndSession,
        handleIPressedRejectEndSession: handleIPressedRejectEndSession,
        iHaveAcceptedEndSession: iHaveAcceptedEndSession,
    };

    useEffect(() => {
        // Reject people with no roomId
        if (router.pathname == "/collab" && roomId === "") {
            router.push("/");
        }
    }, [roomId, router.pathname]);

    // Connect to collab service socket via roomId
    useEffect(() => {
        if (roomId === "") return;
        //TODO: non hardcode url handling
        const socket = io(process.env.NEXT_PUBLIC_COLLAB_SERVER_URL as string, {
            auth: {
                roomId: roomId,
            },
        });
        setSocket(socket);
        socket.on("changeRole", () => {
            console.log("role changed");
            changeRole();
        });
        socket.on("interviewer-chosen", () => {
            console.log("interviewer chosen");
            setInterviewerChosen(true);
        });
        socket.on("interviewee-chosen", () => {
            console.log("interviewee chosen");
            setIntervieweeChosen(true);
        });

        // Server tells clients this when any client clicks on 'Next qn` button
        socket.on("openNextQuestionPrompt", () => {
            setIsNextQnHandshakeOpen(true);
        });

        // Server tells clients this when all clients in room have accepted next question prompt
        socket.on("proceedWithNextQuestion", () => {
            console.log("proceedWithNextQuestion");
            setIsNextQnHandshakeOpen(false);
            setIHaveAcceptedNextQn(false);

            if (questionNumber >= questions.length - 1) {
                setIsEndingSession(true);
            } else {
                setQuestionNumber((prev) => prev + 1);
            }
        });

        // Server tells clients this when a client in room has rejected next question prompt
        socket.on("dontProceedWithNextQuestion", () => {
            console.log("dontProceedWithNextQuestion");
            setSnackBarIsOpen(true);
            setIsNextQnHandshakeOpen(false);
            setIHaveAcceptedNextQn(false);
        });

        // Server tells clients this when any client clicks on 'End session` button
        socket.on("openEndSessionPrompt", () => {
            setIsEndSessionHandshakeOpen(true);
        });

        // Server tells clients this when all clients in room have accepted end session prompt
        socket.on("proceedWithEndSession", () => {
            console.log("proceedWithEndSession");
            setIsEndSessionHandshakeOpen(false);
            setIHaveAcceptedEndSession(false);

            setIsEndingSession(true);
        });

        socket.on("dontProceedWithEndSession", () => {
            console.log("dontProceedWithEndSession");
            setEndSessionSnackBarIsOpen(true);
            setIsEndSessionHandshakeOpen(false);
            setIHaveAcceptedEndSession(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [
        roomId,
        questionNumber,
        isInterviewer,
        isInterviewerChosen,
        isIntervieweeChosen,
    ]);

    // Hadnle end session state when end session button is pressed or no more questions
    useEffect(() => {
        if (isEndingSession) {
            setTimeout(() => {
                setIsEndingSession(false);
                router.push("/");
            }, 3000);
        }
    }, [isEndingSession]);

    // When unmounting this component i.e leaving page, cancel matching (leave matching service socket)
    useEffect(() => {
        return () => {
            cancelMatching();
        };
    }, []);

    return (
        <div>
            <Grid container={true} spacing={2} sx={{ marginTop: "5px" }}>
                <Grid item xs={6}>
                    {questions[questionNumber] ? (
                        <QuestionPanel {...questionPanelProps} />
                    ) : (
                        <p>No more questions available.</p>
                    )}
                </Grid>
                <Grid item xs={6}>
                    <Stack direction="column" spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                            {!isEndingSession && (<CollabPageNavigation
                                {...collabPageNavigationProps}
                            />)}
                        </Box>
                        <CodeEditor
                            language={language}
                            roomId={roomId}
                            editorContent={
                                questions[questionNumber]?.templates?.find(
                                    (template) => template.language === language
                                )?.starterCode ?? ""
                            }
                            question={questions[questionNumber]}
                        />
                    </Stack>
                    {showInterviewerView && (
                        <div className="interviewer-view-container">
                            <InterviewerView />
                        </div>
                    )}
                    <Dialog open={showDialog} onClose={handleClosePickRole}>
                        <DialogTitle>Pick a Role</DialogTitle>
                        <DialogContent>
                            {!isInterviewerChosen && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    style={{ color: "black" }}
                                    onClick={() => {
                                        setInterviewer(true);
                                        setShowDialog(false);
                                        socket?.emit("interviewer chosen");
                                    }}
                                >
                                    Interviewer
                                </Button>
                            )}
                            {!isIntervieweeChosen && (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    style={{ color: "black" }}
                                    onClick={() => {
                                        setInterviewer(false);
                                        setShowDialog(false);
                                        socket?.emit("interviewee chosen");
                                    }}
                                >
                                    Interviewee
                                </Button>
                            )}
                        </DialogContent>
                    </Dialog>
                </Grid>
            </Grid>
            <SimpleSnackbar
                snackBarIsOpen={snackBarIsOpen}
                onClose={handleSnackbarClose}
            />
            <RejectEndSessionSnackBar
                rejectEndSessionSnackBarIsOpen={endSessionSnackBarIsOpen}
                onClose={handleEndSessionSnackbarClose}
            />
            {isEndingSession && (<EndingSessionBackdrop/>)}
        </div>
    );
};

export default CollabPage;
