type Path = `/${string}`;

export default {
  items: {
    GET(id?: string): Path {
      if (id) return `/api/items/${id}`;
      return "/api/items/item-grid";
    },
    PUT(id: string): Path {
      return `/api/items/${id}`;
    },
    POST(): Path {
      return "/api/items/add";
    },
    PATCH(id: string): Path {
      return `/api/items/${id}`;
    },
  },

  customer: {
    GET(id?: string): Path {
      if (id)
        return `/api/company-accounts/customervendordetails?companyAccountId=${id}`;
      return "/api/company-accounts/customervendordata?clientAccountType=customer";
    },
    PUT(id: string): Path {
      return `/api/company-accounts/updateCustomerVendor/${id}`;
    },
    POST(): Path {
      return "/api/company-accounts/addCustomerVendor";
    },
    PATCH(id: string): Path {
      return `/api/company-accounts/updateCustomerVendor/${id}`;
    },
  },

  quote: {
    GET(id?: string): Path {
      if (id) return `/api/items/${id}`;
      return "/api/items/item-grid";
    },
    PUT(id: string): Path {
      return `/api/items/${id}`;
    },
    POST(): Path {
      return "/api/items/add";
    },
    PATCH(id: string): Path {
      return `/api/items/${id}`;
    },
  },
};
