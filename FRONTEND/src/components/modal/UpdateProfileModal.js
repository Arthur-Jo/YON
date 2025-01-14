import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import { doc, updateDoc } from "firebase/firestore";
import bgimg from "image/bgimg.jpg";
import { db } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import { MdCameraEnhance } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdateProfileModal = ({
	updateModal,
	updateModalOpen,
	updateModalClose,
	toggleUpdateState,
}) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [info, setInfo] = useState({
		displayName: currentUser.displayName,
		email: currentUser.email,
		photoURL: currentUser.photoURL,
		description: currentUser.description,
	});
	const fileRef = useRef();
	const bgRef = useRef();
	const textareaRef = useRef();
	const [focused, setFocused] = useState("");

	const [attachment, setAttachment] = useState(currentUser.photoURL);
	const [bg, setBg] = useState(currentUser.bgURL ? currentUser.bgURL : bgimg);

	useEffect(() => {
		setInfo({
			displayName: currentUser.displayName,
			email: currentUser.email,
			photoURL: currentUser.photoURL,
			description: currentUser.description,
		});
	}, [updateModal, currentUser]);

	const onFileChange = (e) => {
		const theFile = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			setAttachment(finishedEvent.currentTarget.result);
		};
		reader.readAsDataURL(theFile);
	};
	const onBgChange = (e) => {
		const theFile = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			setBg(finishedEvent.currentTarget.result);
		};
		reader.readAsDataURL(theFile);
	};

	useEffect(() => {
		setAttachment(currentUser.photoURL);
	}, [currentUser.photoURL]);

	const onChangeInfo = (e, type) => {
		const cp = { ...info };
		cp[type] = e.target.value;
		setInfo(cp);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		updateClick();
		updateModalClose();
		toggleUpdateState();
		await updateDoc(doc(db, "users", currentUser.uid), {
			displayName: info.displayName,
			photoURL:
				attachment === ""
					? "https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6"
					: attachment,
			description: info.description,
			bgURL: bg,
		});
		await dispatch(
			setCurrentUser({
				uid: currentUser.uid,
				photoURL:
					attachment === ""
						? "https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6"
						: attachment,
				email: currentUser.email,
				displayName: info.displayName,
				description: info.description,
				bookmark: currentUser.bookmark,
				follower: currentUser.follower,
				following: currentUser.following,
				rejweet: currentUser.rejweet,
				bgURL: bg,
			})
		);
	};

	const [updateSnack, setUpdateSnack] = useState();
	const updateClick = () => setUpdateSnack(true);
	const updateClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setUpdateSnack(false);
	};

	return (
		<>
			<Modal
				open={updateModal}
				onClose={updateModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="w-2/3 lg:w-1/2 select-none outline-none absolute border border-white top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 origin-center h-auto pt-2 pb-3 bg-white rounded-2xl flex flex-col justify-start items-start">
					{" "}
					<form onSubmit={onSubmit} class="w-full flex flex-col">
						<div class="h-full w-full flex justify-between items-center pb-1 ">
							<div class="flex flex-row items-center">
								<GrClose
									onClick={updateModalClose}
									size={38}
									class="cursor-pointer mx-2 p-2 hover:bg-gray-200 rounded-full"
								/>
								<p class="text-xl font-bold">Update Profile</p>
							</div>
							<div class="flex flex-row justify-center items-center">
								<input
									type="submit"
									class="cursor-pointer font-bold bg-black px-3 mr-2 py-1 rounded-full text-white hover:opacity-60"
									value="Save"
								/>
							</div>
						</div>
						<div class="w-full flex flex-col relative">
							<div class="relative h-36 w-full bg-purple-100">
								<img src={bg} alt="bgimg" class="w-full h-full object-cover" />
								<div
									onClick={() => bgRef.current.click()}
									class="cursor-pointer absolute p-1 top-0 w-full h-full object-cover"
								>
									<div class="w-full h-full object-cover opacity-20 bg-black flex justify-center items-center"></div>
									<div class="w-full h-full absolute top-0 left-0 flex justify-center text-white items-center opacity-70">
										<MdCameraEnhance size={24} />
									</div>
								</div>
							</div>
							<div class="h-16 w-full flex flex-row-reverse items-center pr-4">
								<div class="cursor-pointer font-bold text-base flex justify-center items-center px-4 py-2"></div>
							</div>
							<div class="absolute w-28 h-28 left-4 bottom-2 ">
								<div class="w-28 h-28 bg-white border-4 border-white rounded-full">
									<img
										src={attachment}
										class="w-28 h-full object-cover rounded-full"
										alt="img"
									/>
								</div>
								<div
									onClick={() => fileRef.current.click()}
									class="cursor-pointer absolute p-1 top-0 w-full h-full object-cover rounded-full"
								>
									<div class="w-full h-full object-cover rounded-full opacity-20 bg-black flex justify-center items-center"></div>
									<div class="w-full h-full absolute top-0 left-0 flex justify-center text-white items-center opacity-70">
										<MdCameraEnhance size={24} />
									</div>
								</div>
							</div>
						</div>
						<div class="w-full flex flex-col px-4 mt-2 mb-2">
							<div
								class={
									"mt-2 select-none w-full h-14 rounded-md transition delay-50 duration-300 flex flex-col px-2 py-1 relative " +
									(info.displayName === ""
										? "border-2 border-red-500"
										: focused === "name"
										? "border-2 border-blue-500 shadow-sm "
										: "border-2 border-gray-200")
								}
							>
								<div
									class={
										"w-full h-4 text-xs transition delay-50 duration-300  " +
										(info.displayName === ""
											? "text-red-500"
											: focused === "name"
											? "text-blue-500"
											: "text-gray-500")
									}
								>
									Name
								</div>
								<input
									type="text"
									value={info.displayName}
									onFocus={() => setFocused("name")}
									onBlur={() => setFocused("")}
									onChange={(e) => onChangeInfo(e, "displayName")}
									class="w-full outline-none text-sm mt-1"
								/>
							</div>

							<p
								class={
									"text-red-500 mb-2 text-xs px-1 transition delay-50 duration-300 " +
									(info.displayName === "" ? "block" : "hidden")
								}
							>
								Name can't be blank
							</p>

							<div
								class={
									"my-2 select-none w-full h-auto rounded-md border border-gray-300 flex flex-col px-2 py-1 " +
									(focused === "description"
										? "border-2 border-blue-500 shadow-sm "
										: "border-2 border-gray-200")
								}
							>
								<div
									class={
										"w-full h-4 text-xs text-gray-500 mb-1 " +
										(focused === "description"
											? "text-blue-500"
											: "text-gray-500")
									}
								>
									Description
								</div>

								<textarea
									type="text"
									ref={textareaRef}
									value={info.description}
									onFocus={() => setFocused("description")}
									onBlur={() => setFocused("")}
									onChange={(e) => onChangeInfo(e, "description")}
									class="w-full py-1 resize-none overflow-hidden scroll leading-5 outline-none text-sm "
								/>
							</div>
						</div>

						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							class="hidden"
							onChange={onFileChange}
						/>
						<input
							ref={bgRef}
							type="file"
							accept="image/*"
							class="hidden"
							onChange={onBgChange}
						/>
					</form>
				</div>
			</Modal>
			<Snackbar
				open={updateSnack}
				autoHideDuration={2000}
				onClose={updateClose}
			>
				<Alert
					onClose={updateClose}
					severity="success"
					color="success"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{updateSnack ? "프로필 변경!" : ""}
				</Alert>
			</Snackbar>
		</>
	);
};

export default UpdateProfileModal;
