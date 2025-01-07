import {
  RESOLVE_CONTRACT_MASTER_API,
  RESOLVE_EMPLOYEE_API,
  RESOLVE_ORGANISATION_OPTIONS,
  RESOLVE_ORGANISATION_STRUCTURE_API,
  RESOLVE_TOKEN,
} from "@/lib/server-urls";
import { Employee } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export interface SubType {
  sub_type_id: string;
  sub_type: string;
}

interface EmployeeAPIResponse {
  result: string;
  statuscode: number;
  message: string;
  data: {
    data: Employee[];
  };
}

interface OrganisationStructureAPIResponse {
  result: string;
  statuscode: number;
  message: string;
  org_id: string;
  configs: {
    id: string;
    type_id: string;
    category_name: string;
    sub_types: SubType[];
  };
}

export interface OrgAttributes {
  id: number;
  sub_type_id: number;
  category_name: string;
  attribute_name: string;
  description: string;
}

interface OrganisationOptionsAPIResponse {
  result: string;
  statuscode: number;
  message: string;
  orgAttributes: OrgAttributes[];
}

export interface Options {
  [key: string]: OrgAttributes[];
}

export interface ContractMaster {
  id: string;
  customer_worker_type: string;
  worker_type_id: string;
  worker_type: string;
  contract_agreement_type_id: string;
  contract_agreement_type: string;
  tenor_id: string;
  tenor_type: string;
  work_method_list: {
    work_location_id: string;
    work_location_type: string;
  }[];
  basis_pay_list: {
    basis_pay_id: string;
    basis_pay_name: string;
  }[];
  pay_document_type_id: string;
  pay_document_type: string;
  termination_type_list: {
    termination_type_id: string;
    termination_type: string;
    years: string;
    months: string;
    days: string;
  }[];
}

export interface ContractMasterResponse {
  result: string;
  statuscode: number;
  message: string;
  worker_type_data: ContractMaster[];
}

export function useResolveAPI() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [organisationStructure, setOrganisationStructure] =
    useState<OrganisationStructureAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Options | null>(null);
  const [contractMaster, setContractMaster] =
    useState<ContractMasterResponse | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchOrganisationStructure();
    fetchContractMaster();
  }, []);

  async function fetchEmployees() {
    setIsLoading(true);
    try {
      const response = await axios.post<EmployeeAPIResponse>(
        RESOLVE_EMPLOYEE_API,
        {
          userBlocks: [1, 3, 4],
          userWise: 0,
          workerType: 0,
          attribute: 0,
          subAttributeId: 0,
        },
        {
          headers: {
            Authorization: RESOLVE_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      setEmployees(response.data.data.data);
    } catch (error: any) {
      console.log("Error fetching employees", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchOrganisationStructure() {
    setIsLoading(true);
    try {
      const response = await axios.get<OrganisationStructureAPIResponse>(
        RESOLVE_ORGANISATION_STRUCTURE_API,
        {
          headers: {
            Authorization: RESOLVE_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      setOrganisationStructure(response.data);

      const optionsMap: Record<string, any[]> = {};
      for (const subType of response.data.configs.sub_types) {
        const options =
          (await getOrganisationOptions(subType.sub_type_id)) || [];
        optionsMap[subType.sub_type] = options;
      }
      setOptions(optionsMap);
    } catch (error: any) {
      console.log("Error fetching organisation structure", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getOrganisationOptions(id: string) {
    setIsLoading(true);
    try {
      const response = await axios.get<OrganisationOptionsAPIResponse>(
        `${RESOLVE_ORGANISATION_OPTIONS}/${id}`,
        {
          headers: {
            Authorization: RESOLVE_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.orgAttributes;
    } catch (error: any) {
      console.log("Error fetching organisation structure", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchContractMaster() {
    setIsLoading(true);
    try {
      const response = await axios.get<ContractMasterResponse>(
        RESOLVE_CONTRACT_MASTER_API,
        {
          headers: {
            Authorization: RESOLVE_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      setContractMaster(response.data);
    } catch (error: any) {
      console.log("Error fetching contract master", error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    fetchEmployees,
    employees,
    fetchOrganisationStructure,
    organisationStructure,
    getOrganisationOptions,
    isLoading,
    options,
    contractMaster,
    fetchContractMaster,
  };
}
