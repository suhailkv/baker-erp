import { useCallback, useState } from "react";
import { api } from "../../../lib/api";

export const useProductions = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchProductions = useCallback(
        async ({ page, pageSize, sortModel, searchText }) => {
            const { data } = await api.get("/productions", {
                params: {
                    page: page + 1,
                    pageSize,
                    search: searchText || "",
                    sort: sortModel.length ? sortModel[0].field : undefined,
                    order: sortModel.length ? sortModel[0].sort : undefined,
                },
            });

            return {
                rows: (data.rows || []).map((r) => ({
                    id: r.id,
                    ...r,
                    productName: r.ExpenseNameMaster?.expense_name,
                })),
                total: data.total,
            };
        },
        [refreshKey]
    );

    const updateStatus = async (id, status) => {
        await api.patch(`/productions/${id}/status`, { status });
        setRefreshKey((prev) => prev + 1);
    };

    const refresh = () => setRefreshKey((prev) => prev + 1);

    return { fetchProductions, updateStatus, refreshKey, refresh };
};

