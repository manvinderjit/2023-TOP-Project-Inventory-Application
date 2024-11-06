import { Types } from "mongoose";
import { validateIsNumber } from "../../utilities/validation.js";
import { roundOffPrices } from "../../utilities/number.utilities.js";
import { getStockOfItems } from "../services/orders.api.services.js";

export interface OrderItem {
    _id: Types.ObjectId;
    itemQuantity: number;
    price: number;
    name: string;
}

// Check if item quantity and item price in orders are valid numerical values
const itemDataValidation = (orderItems: OrderItem[]): string[] => {
    const invalidItems: string[] = [];
    // const invalidItems: string[] = orderItems.filter(
    //     (item) =>
    //         !validateIsNumber(String(item.itemQuantity)) ||
    //         !validateIsNumber(String(item.price))
    // ).map(item => item.name);

    orderItems.forEach((item) => {
        if (
            !validateIsNumber(String(item.itemQuantity)) ||
            !Number.isInteger(Number(item.itemQuantity)) ||
            !validateIsNumber(String(item.price))
        ) {
            invalidItems.push(item.name);
        }
    });

    return invalidItems;
};

// Check if items ordered exist in inventory
const allItemsExist = (
    itemIds: string[],
    itemStocks: { _id: Types.ObjectId; stock: number }[],
): boolean =>
    itemIds.every((itemId) =>
        itemStocks.some((item) => String(item._id) === String(itemId)),
    );

// Check if there is sufficient inventory stock for ordered items
const checkAllItemsInStock = (
    itemIdsAndStock: { id: string; qty: number }[],
    itemsWithStocks: { _id: Types.ObjectId; stock: number; name: string }[],
): { allItemsInStock: boolean; itemsWithNotStock: string[] } => {
    const itemsWithNotStock: string[] = [];
    const allItemsInStock: boolean = itemIdsAndStock.every((itemIdAndStock) =>
        itemsWithStocks.some((item) => {
            if (
                String(item._id) === String(itemIdAndStock.id) &&
                Number(item.stock) < Number(itemIdAndStock.qty)
            )
                itemsWithNotStock.push(item.name);

            return (
                String(item._id) === String(itemIdAndStock.id) &&
                Number(item.stock) >= Number(itemIdAndStock.qty)
            );
        }),
    );
    return { allItemsInStock, itemsWithNotStock };
};

// Validate order total
const validateUserOrderTotal = (orderItems: any[], totalAmount: number) => {
    let total = 0;
    total = orderItems.reduce(
        (
            accumulator: number,
            currentItem: { itemQuantity: number; price: any },
        ) => accumulator + currentItem.itemQuantity * Number(currentItem.price),
        0,
    );
    return roundOffPrices((total + 10) * 1.13) === totalAmount;
};

// Validate the user order information
export const validateUserOrder = async (
    orderItems: OrderItem[],
    totalAmount: number,
) => {
    let orderValidationErrors = null;

    // Extract the following fields from order details for use in validation
    const itemIds: string[] = [];
    const itemIdsAndStock: { id: string; qty: number }[] = [];
    orderItems.forEach((item) => {
        itemIds.push(String(item._id));
        itemIdsAndStock.push({ id: String(item._id), qty: item.itemQuantity });
    });

    // Get stock inventory of all items from the database
    const itemsStock = await getStockOfItems(itemIds);

    // Check if all items have sufficient stock
    const itemStockAvailableStatus = checkAllItemsInStock(
        itemIdsAndStock,
        itemsStock,
    );

    // Check if the item values in order have valid values
    const itemDataValidationResult = itemDataValidation(orderItems);

    // Set Validation Error
    switch (true) {
        case allItemsExist(itemIds, itemsStock) === false: {
            orderValidationErrors = `Order information is incorrect!`;
            break;
        }
        case itemDataValidationResult.length > 0: {
            orderValidationErrors = `Products have invalid data: ${itemDataValidationResult}!`;
            break;
        }
        case itemStockAvailableStatus.allItemsInStock === false: {
            orderValidationErrors = `Products have insufficient stock: ${itemStockAvailableStatus.itemsWithNotStock}!`;
            break;
        }
        case !validateUserOrderTotal(orderItems, totalAmount): {
            orderValidationErrors = `Order information is incorrect!`;
            break;
        }
        default: {
            null;
        }
    }
    return orderValidationErrors;
};
