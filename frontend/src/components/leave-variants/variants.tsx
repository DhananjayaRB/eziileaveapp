import * as FadeIn from "@/components/animation";
import { LeaveVariant } from "@/lib/types";
import { Icon, Text, VStack } from "@chakra-ui/react";
import { CgTrashEmpty } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { Button } from "../core/button";

interface Props {
  variants: LeaveVariant[];
  handleDelete: (id: number) => void;
  handleEdit: (variant: LeaveVariant) => void;
  accent: string;
  handleCreate: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

export function ShowVariants({
  variants,
  handleDelete,
  handleEdit,
  accent,
  handleCreate,
  handlePrevious,
  handleNext,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm space-y-4 h-auto md:h-[90%] md:p-5 overflow-y-scroll">
      <div className="p-4 md:p-6 h-full">
        <FadeIn.Item>
          <Text
            fontWeight={600}
            fontSize={{ base: "xl", md: "3xl" }}
            className="mb-8 text-left"
          >
            Variants
          </Text>
        </FadeIn.Item>

        <div>
          {variants.map((variant) => (
            <div key={variant.id} className="w-full">
              <FadeIn.Item>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b border-[#E6E6E7] md:h-14 md:py-0 md:mb-4 md:border-none">
                  <div className="flex-col items-center">
                    <Text fontSize={{ base: 14, md: 18 }} fontWeight={600}>
                      {variant.variantName}
                    </Text>
                    <Text
                      fontSize={{ base: 14, md: 16 }}
                      fontWeight={300}
                      color="#637587"
                    >
                      Applied to {variant.assignedTo?.length} Employees
                    </Text>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      display={{ base: "none", md: "inline" }}
                      variant="outline"
                      icon={FaTrash}
                      iconPosition="right"
                      onClick={() => handleDelete(variant.id!)}
                      borderColor={accent}
                      applyColor={accent}
                    >
                      Delete
                    </Button>
                    <Icon
                      as={CgTrashEmpty}
                      display={{ base: "inline", md: "none" }}
                      fontSize={24}
                      color={accent}
                      strokeWidth={1}
                      onClick={() => handleDelete(variant.id!)}
                    />
                    <Button
                      display={{ base: "none", md: "inline" }}
                      icon={GoPencil}
                      iconPosition="right"
                      variant="outline"
                      onClick={() => handleEdit(variant)}
                    >
                      Edit
                    </Button>
                    <Icon
                      as={GoPencil}
                      onClick={() => handleEdit(variant)}
                      display={{ base: "inline", md: "none" }}
                      fontSize={24}
                      color="#08705C"
                    />
                  </div>
                </div>
              </FadeIn.Item>
            </div>
          ))}
          <Button
            variant="outline"
            icon={FiPlus}
            iconPosition="right"
            display={{ base: "none", md: "inline" }}
            onClick={handleCreate}
          >
            Create Leave Variant
          </Button>
          <div className="w-full mt-5">
            <FadeIn.Item>
              <Button
                display={{ base: "block", md: "none" }}
                variant="outline"
                icon={FiPlus}
                iconPosition="right"
                onClick={handleCreate}
              >
                Create Leave variant
              </Button>
            </FadeIn.Item>
          </div>
        </div>

        <div>
          <FadeIn.Item>
            <VStack display={{ base: "block", md: "none" }} mt="100%">
              <Button
                variant="outline"
                icon={FiChevronLeft}
                iconPosition="right"
                onClick={handlePrevious}
                w="100%"
                py={3}
              >
                Previous
              </Button>
              <Button
                mt={2}
                variant="solid"
                icon={FiChevronRight}
                iconPosition="right"
                onClick={handleNext}
                py={3.5}
                w="100%"
              >
                Next
              </Button>
            </VStack>
          </FadeIn.Item>
        </div>
      </div>
    </div>
  );
}
