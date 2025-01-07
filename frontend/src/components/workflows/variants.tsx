"use client";

import { Workflow } from "@/lib/types";
import { Button } from "../core/button";
import * as FadeIn from "@/components/animation";
import { FaChevronRight, FaPlus } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  workflows: Workflow[];
}

export function WorkflowVariants({ workflows }: Props) {
  const router = useRouter();
  return (
    <FadeIn.Item>
      <div className="flex flex-col md:flex-col items-start justify-between rounded-lg space-y-4 md:space-y-6">
        <Link href="/setup/create-workflow">
          <Button py={3} icon={FaPlus} iconPosition="right">
            Create Workflow
          </Button>
        </Link>

        <TableContainer
          border="1px solid #D9D9D9"
          w="100%"
          bg="white"
          borderRadius="12px"
        >
          <Table variant="simple">
            <Thead bg="#F2F5F8">
              <Tr>
                <Th
                  fontSize="14px"
                  color="black"
                  fontWeight={700}
                  textTransform="none"
                >
                  Workflow Name
                </Th>
                <Th
                  fontSize="14px"
                  color="black"
                  fontWeight={700}
                  textTransform="none"
                >
                  Created on
                </Th>
                <Th
                  fontSize="14px"
                  color="black"
                  fontWeight={700}
                  textTransform="none"
                >
                  Created by
                </Th>
                <Th
                  fontSize="14px"
                  color="black"
                  fontWeight={700}
                  textTransform="none"
                >
                  Employees involved
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {workflows.map((workflow) => (
                <Tr
                  key={workflow.id}
                  onClick={() => router.push(`/setup/workflows/${workflow.id}`)}
                  cursor="pointer"
                >
                  <Td>{workflow.name}</Td>
                  <Td>
                    {new Date(workflow.createdAt!).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                  <Td>{workflow.createdBy?.name}</Td>
                  <Td>{workflow.employeesInvolved}</Td>
                  <Td>
                    <FaChevronRight className="h-4 w-4" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </FadeIn.Item>
  );
}
