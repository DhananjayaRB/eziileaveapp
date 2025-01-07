import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ContractMaster, OrgAttributes, useResolveAPI } from "@/hooks/resolve";
import { Flex, Text } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { Button } from "../core/button";
import { DataTableFacetedFilter } from "../core/data-table-faceted-filter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  table: Table<any>;
}

const transformOptions = (options: OrgAttributes[] | undefined) => {
  if (!options) return [];

  return options.map((option) => ({
    value: option.attribute_name,
    label: option.attribute_name,
  }));
};

const transformContractTypeOptions = (
  options: ContractMaster[] | undefined
) => {
  if (!options) return [];

  return options.map((option) => ({
    value: option.customer_worker_type,
    label: option.customer_worker_type,
  }));
};

const filterTableMapping: { [key: string]: string } = {
  Location: "type_id_0",
  Department: "type_id_1",
  Division: "type_id_2",
  Customer: "type_id_8",
  Process: "type_id_9",
  "Sub-Process": "type_id_11",
  "Sub Location": "type_id_16",
  "Org State": "type_id_18",
};

export default function FiltersModal({ isOpen, onClose, table }: Props) {
  const { organisationStructure, options, contractMaster } = useResolveAPI();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const applyFilters = () => {
    onClose();
  };

  const content = (
    <Flex direction="column" gap={4} p={4} w="100%">
      {organisationStructure?.configs.sub_types.map((subType) => (
        <Flex
          key={subType.sub_type}
          direction="column"
          gap={2}
          w={{ base: "100%", md: "50%" }}
          py={2}
          borderRadius="12px"
        >
          <Text fontWeight="600" fontSize="14px">
            {subType.sub_type}
          </Text>

          <DataTableFacetedFilter
            column={table.getColumn(filterTableMapping[subType.sub_type])}
            options={transformOptions(options?.[subType.sub_type])}
            title={subType.sub_type}
          />
        </Flex>
      ))}

      <Flex
        direction="column"
        gap={2}
        w={{ base: "100%", md: "50%" }}
        py={2}
        borderRadius="12px"
      >
        <Text fontWeight="600" fontSize="14px">
          Contract Type
        </Text>

        <DataTableFacetedFilter
          column={table.getColumn("worker_type")}
          options={transformContractTypeOptions(
            contractMaster?.worker_type_data
          )}
          title="Contract Type"
        />
      </Flex>
    </Flex>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent className="h-[60vh]">
            <DrawerHeader>
              <DrawerTitle>Apply Filters</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription className="h-[40vh] border border-[#08705C] overflow-y-auto rounded-lg p-3 w-full">
              {content}
            </DrawerDescription>
            <DrawerFooter>
              <Button
                onClick={applyFilters}
                py={3}
                icon={IoCheckmark}
                iconPosition="right"
              >
                Apply Filters
              </Button>
              <DrawerClose>
                <Button py={3} variant="outline" onClick={onClose} w="100%">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-[#F2F3F3] sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Apply Filters
              </DialogTitle>
            </DialogHeader>

            <div className="p-4">
              <Flex
                w="100%"
                h="55vh"
                p={3}
                border="1px solid #08705C"
                overflowY="auto"
                borderRadius="12px"
              >
                {content}
              </Flex>
            </div>

            <DialogFooter className="flex flex-row items-center justify-between w-full">
              <Flex gap={3}>
                <Button
                  py={3}
                  variant="outline"
                  onClick={onClose}
                  fontSize={18}
                >
                  Close
                </Button>
                <Button
                  onClick={applyFilters}
                  py={3}
                  icon={IoCheckmark}
                  iconPosition="right"
                >
                  Apply Filters
                </Button>
              </Flex>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
