"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import { CiCircleMore } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";
import { Calendar } from "@/components/ui/calendar";
import { Tabs } from "@/components/ui/tabs";
import { FiArrowUpRight } from "react-icons/fi";

export function ApprovalRequest() {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [date, setDate] = React.useState<Date | null>(null);
  const [activeButton, setActiveButton] = useState("Leaves");

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  const fetchApprovalRequest = async () => {
    // const res = await fetch("http://localhost:4000/api/approval-request", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await res.json();
    // setData(data);
  };

  React.useEffect(() => {
    fetchApprovalRequest();
  }, []);

  const handleApprovalRequest = (id: string) => {
    router.push(`/approval-request/${id}`);
  };

  const handleCreateApprovalRequest = () => {
    router.push(`/approval-request/create`);
  };

  const handleDeleteApprovalRequest = (id: string) => {
    // const res = await fetch(`http://localhost:4000/api/approval-request/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await res.json();
    // setData(data);
  };

  const handleUpdateApprovalRequest = (id: string) => {
    router.push(`/approval-request/${id}/edit`);
  };

  const handleViewApprovalRequest = (id: string) => {
    router.push(`/approval-request/${id}/view`);
  };

  const handleApproveApprovalRequest = (id: string) => {
    // const res = await fetch(`http://localhost:4000/api/approval-request/${id}/approve`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const data = await res.json();
    // setData(data);
  };

  const Listing = ({ data }) => {
    return (
      <>
        <div className="w-full flex flex-col space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center"
            >
              <Stack direction="row" spacing={4}>
                <Avatar
                  name="Segun Adebayo"
                  src="https://bit.ly/sage-adebayo"
                />
                <Stack direction={"column"} spacing={2}>
                  <div>
                    <Text>Janee Doe</Text>
                    <Text>Jun 1,2023 - Jun 15, 2023</Text>
                  </div>
                  <div>
                    <Text>14 Days</Text>
                    <Text>(10 working, 2 non-working days)</Text>
                  </div>
                </Stack>
              </Stack>
              <div className="flex space-x-4">
                <Button
                  variant={"solid"}
                  color={"green"}
                  onClick={() => handleViewApprovalRequest(item.id)}
                >
                  View <FiArrowUpRight />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm space-y-4 h-auto md:h-[90%] overflow-y-scroll md:p-5 ">
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <Text
              fontWeight={700}
              fontSize={{ base: 18, md: 24 }}
              color="#383838"
              mb={{ base: 4, md: 0 }}
            >
              Approvals
            </Text>
          </div>
        </div>
        {/* <Stack spacing={2} direction={'row'}>
          <Button background={'black'}>Leaves (12)</Button>
          <Button>Pto (4)</Button>
          <Button>Comp-Off (2)</Button>
        </Stack> */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              activeButton === "Leaves"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleButtonClick("Leaves")}
          >
            Leaves (12)
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeButton === "Pto"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleButtonClick("Pto")}
          >
            Pto (4)
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeButton === "Comp-Off"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleButtonClick("Comp-Off")}
          >
            Comp-Off (2)
          </button>
        </div>
        <Box background="ActiveBorder" width="100%" padding="4" color="white">
          <Tabs defaultValue="All">
            <Tabs>
              <Tabs value="All">All</Tabs>
              <Tabs value="Pending">
                Pending (4) <CiCircleMore />
              </Tabs>
              <Tabs value="Approved">
                Approved <FaCheck />
              </Tabs>
              <Tabs value="Rejected">
                Rejected <MdBlock />
              </Tabs>
              <Tabs value="Availed">
                Availed <RiCheckDoubleFill />
              </Tabs>
              <Tabs value="View All">
                View All <FiArrowUpRight />
              </Tabs>
            </Tabs>
            <Tabs value="All">
              <Listing data={data} />
            </Tabs>
            <Tabs value="Pending">
              <Listing data={data} />
            </Tabs>
            <Tabs value="Approved">
              <Listing data={data} />
            </Tabs>
            <Tabs value="Rejected">
              <Listing data={data} />
            </Tabs>
            <Tabs value="Availed">
              <Listing data={data} />
            </Tabs>
            <Tabs value="View All">
              <Listing data={data} />
            </Tabs>
          </Tabs>
        </Box>
      </div>
    </>
  );
}
