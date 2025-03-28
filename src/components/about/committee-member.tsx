import React from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type CommitteeMemberProps = {
  member: {
    id: string;
    image: string;
    name: string;
    designation: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  };
};
export default function CommitteeMember({ member }: CommitteeMemberProps) {
  return (
    <CardContainer className="inter-var grow">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border  ">
        <CardItem
          as="p"
          translateZ="50"
          className="w-full px-6 rounded-lg text-center"
        >
          <button className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
            <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <span className="relative z-20">{member?.designation}</span>
          </button>
        </CardItem>
        <CardItem
          translateZ="100"
          scale={1.1}
          className="w-full mt-4 h-[300px] rounded-lg"
        >
          <Image
            src={member?.image}
            alt={member?.name}
            fill
            className="object-cover rounded-xl group-hover/card:shadow-xl"
          />
        </CardItem>
        <CardItem
          translateZ="50"
          className="w-auto px-4 py-2 rounded-xl text-2xl font-normal text-center"
        >
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              {member?.name}
            </span>
          </button>
        </CardItem>
        {/* <CardItem
            translateZ={20}
            translateX={40}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            {member?.designation}
          </CardItem> */}
      </CardBody>
    </CardContainer>
  );
}
