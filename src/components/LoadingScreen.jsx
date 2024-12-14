import React from "react";
import { motion } from "framer-motion";
import { Search, Trophy, ArrowLeft, ArrowRight } from "lucide-react";

const AnimatedIcon = ({ icon: Icon, delay }) => (
	<motion.div
		initial={{ scale: 0 }}
		animate={{ scale: 1 }}
		transition={{
			type: "spring",
			stiffness: 260,
			damping: 20,
			delay: delay,
		}}
		className="p-2"
	>
		<Icon className="w-6 h-6" />
	</motion.div>
);

const AnimatedVersus = () => (
	<motion.div
		className="flex items-center justify-center gap-1"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ delay: 0.3 }}
	>
		<motion.div
			animate={{
				x: [-2, 2, -2],
			}}
			transition={{
				duration: 1.5,
				repeat: Infinity,
				repeatType: "reverse",
			}}
		>
			<ArrowLeft className="w-4 h-4 text-red-500" />
		</motion.div>
		<span className="text-sm font-bold mx-1">VS</span>
		<motion.div
			animate={{
				x: [2, -2, 2],
			}}
			transition={{
				duration: 1.5,
				repeat: Infinity,
				repeatType: "reverse",
			}}
		>
			<ArrowRight className="w-4 h-4 text-blue-500" />
		</motion.div>
	</motion.div>
);

const LoadingScreen = () => {
	return (
		<div className="flex items-center justify-center p-2">
			<div className="text-center">
				{/* <p className="text-sm font-medium mb-2">Finding Match...</p> */}
				<div className="flex justify-center items-center gap-4">
					<AnimatedIcon icon={Search} delay={0} />
					<AnimatedVersus />
					<AnimatedIcon icon={Trophy} delay={0.2} />
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
