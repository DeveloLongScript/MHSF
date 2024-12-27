export const defaultBanners: {
	bannerSpace: number;
	bannerContent: React.ReactNode;
}[] = [
	// The sponsor banner ALWAYS has to be first.
	// {
	//   bannerSpace: 2,
	//   bannerContent: (
	//     <MainBanner size={2} className="max-h-[4rem] border-0">
	//       {" "}
	//       <GradientBanner>
	//         <strong>???</strong> — <i>an official affiliate of MHSF</i>{" "}
	//         <br />
	//         Lorem ipsum odor amet, consectetuer adipiscing elit. — check it out
	//       </GradientBanner>
	//     </MainBanner>
	//   ),
	// },
];

export const bannerHooks: (() =>
	| { bannerSpace: number; bannerContent: React.ReactNode }
	| undefined)[] = [
	() => {
		// if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production")
		//   return {
		//     bannerSpace: 1,
		//     bannerContent: (
		//       <MainBanner className="bg-orange-600">
		//         Your not in production!{" "}
		//         <Link href="https://mhsf.app">
		//           <Button variant="link" className="dark:text-black">
		//             Go to production
		//           </Button>
		//         </Link>
		//       </MainBanner>
		//     ),
		//   };
		return undefined;
	},
];
