import Picker from "emoji-picker-react";
import { doc, updateDoc } from "firebase/firestore";
import defaultImg from "image/defaultImg.jpg";
import { db } from "mybase";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { IoImageOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";

const UpdateJweetBox = ({ _jweet, handleUpdateClose }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const [jweet, setJweet] = useState(_jweet.text);
	const [attachment, setAttachment] = useState(_jweet.attachmentUrl);
	const textareaRef = useRef();
	const fileRef = useRef();
	const emojiRef = useRef();
	const [emojiClick, setEmojiClick] = useState(false);
	const toggleEmoji = () => setEmojiClick(!emojiClick);

	const onEmojiClick = (event, emojiObject) => {
		const newText =
			jweet.slice(0, textareaRef.current.selectionStart) +
			emojiObject.emoji +
			jweet.slice(textareaRef.current.selectionEnd, jweet.length);
		setJweet(newText);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		handleUpdateClose();
		if (jweet === "" || attachment === "") {
		}

		await updateDoc(doc(db, "jweets", _jweet.id), {
			text: jweet,
			attachmentUrl: attachment === null ? "" : attachment,
		});
	};
	const onChange = (e) => {
		setJweet(e.target.value);
	};

	const onFileChange = (e) => {
		const theFile = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			setAttachment(finishedEvent.currentTarget.result);
		};
		reader.readAsDataURL(theFile);
	};
	const clearAttachment = () => {
		setAttachment(null);
	};

	useEffect(() => {
		if (textareaRef === null || textareaRef.current === null) {
			return;
		}
		textareaRef.current.style.height = "40px";
		textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
	}, []);

	useEffect(() => {
		if (!emojiClick) return;
		function handleClick(e) {
			if (emojiRef.current === null) {
				return;
			} else if (!emojiRef.current.contains(e.target)) {
				setEmojiClick(false);
			}
		}
		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [emojiClick]);

	const handleResizeHeight = useCallback(() => {
		if (textareaRef === null || textareaRef.current === null) {
			return;
		}
		textareaRef.current.style.height = "40px";
		textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
	}, []);

	return (
		<>
			<div class="flex flex-row px-2 pt-2 border-b border-gray-200">
				<div class="flex flex-col">
					<div class="h-16 w-16 p-2">
						<img
							src={currentUser.photoURL ? currentUser.photoURL : defaultImg}
							class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
							alt="img"
						/>
					</div>
				</div>
				<form onSubmit={onSubmit} class="w-full flex flex-col px-4 pb-2">
					<div class="w-full border-b border-gray-200 mb-2">
						<textarea
							type="text"
							value={jweet}
							ref={textareaRef}
							onChange={onChange}
							placeholder="What's happening?"
							onInput={handleResizeHeight}
							class="w-full py-3 resize-none h-10 overflow-hidden scroll leading-7 outline-none text-lg text-purple-300 focus:text-purple-500"
						/>
						{attachment && (
							<div class="w-full h-96 relative">
								<img src={attachment} class="h-60 object-cover" alt="preview" />
								<div
									class="absolute left-0 top-0 w-auto h-auto opacity-70 cursor-pointer"
									onClick={clearAttachment}
								>
									<MdCancel size={28} alt="remove" />
								</div>
							</div>
						)}
					</div>
					<div class="flex flex-row justify-between items-center pr-2">
						{/* 좌측 아이콘 */}
						<div class="flex flex-row items-center text-purple-300 relative">
							<div
								onClick={() => fileRef.current.click()}
								class="p-2 transition delay-50 duration-300 hover:bg-purple-100 rounded-full blur-md cursor-pointer"
							>
								<IoImageOutline size={20} />
							</div>
							<div
								onClick={toggleEmoji}
								class="p-2 transition delay-50 duration-300 hover:bg-purple-100 rounded-full blur-md cursor-pointer"
							>
								<GrEmoji size={20} />
							</div>
							{emojiClick && (
								<div ref={emojiRef} class="absolute top-10">
									<Picker onEmojiClick={onEmojiClick} />
								</div>
							)}
						</div>
						{/* 우측 submit */}
						<div>
							<input
								type="submit"
								class="text-sm w-full rounded-full text-white font-bold bg-purple-400 flex justify-center px-4 py-2 hover:bg-purple-600 transition delay-50 duration-300 cursor-pointer"
								value="Jweet"
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
				</form>
			</div>
		</>
	);
};

export default UpdateJweetBox;
