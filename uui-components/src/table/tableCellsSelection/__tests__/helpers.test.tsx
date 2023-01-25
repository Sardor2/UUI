import { getCell, getCellPosition, getCellToCopyFrom, getNormalizedLimits } from "../hooks/helpers";
import { rowsMock, columnsMock } from '../mocks';

describe('getNormalizedLimits', () => {
    it('should return normalized limits', () => {
        expect(getNormalizedLimits(0, 100)).toEqual([0, 100]);
        expect(getNormalizedLimits(100, 0)).toEqual([0, 100]);
        expect(getNormalizedLimits(0, 0)).toEqual([0, 0]);
    });
});

describe('getCell', () => {
    it('should get cell by coordinates', () => {
        const { row, column } = getCell(1, 1, rowsMock, columnsMock);
        const expectedColumn = columnsMock[1];
        const expectedRow = rowsMock[1];

        expect(column).toEqual(expectedColumn);
        expect(row).toEqual(expectedRow);
    });

    it('should return null if out of range', () => {
        expect(getCell(rowsMock.length, 1, rowsMock, columnsMock)).toBeNull();
        expect(getCell(1, columnsMock.length, rowsMock, columnsMock)).toBeNull();
    });
});

describe('getCellToCopyFrom', () => {
    it('should find a cell to copy from by coordinates', () => {
        const copyCellColumn = 0;
        const copyCellRow = 1;
        const expectedColumn = columnsMock[copyCellColumn];
        const expectedRow = rowsMock[copyCellRow];
        const selectionRange = { startColumnIndex: copyCellColumn, startRowIndex: copyCellRow, endColumnIndex: 1, endRowIndex: 2 };

        const { column, row } = getCellToCopyFrom(selectionRange, rowsMock, columnsMock);
        expect(column).toEqual(expectedColumn);
        expect(row).toEqual(expectedRow);
    });

    it('should return null if no cell was selected', () => {
        expect(getCellToCopyFrom(null, rowsMock, columnsMock)).toBeNull();
    });
});


describe('getCellPosition', () => {
    it('should detect if cell is selected', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(1, 1, selectionRange)).toEqual({
            isSelected: true,
            isLeft: false, isRight: false, isTop: false, isBottom: false, isStartCell: false,
        });
    });
    it('should detect if cell is a cell to copy from', () => {
        const selectionRange1 = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(0, 0, selectionRange1)).toEqual({
            isLeft: true, isTop: true, isSelected: true, isStartCell: true,
            isRight: false, isBottom: false,
        });

        const selectionRange2 = { startColumnIndex: 4, startRowIndex: 4, endColumnIndex: 0, endRowIndex: 0 };
        expect(getCellPosition(4, 4, selectionRange2)).toEqual({
            isBottom: true, isSelected: true, isStartCell: true, isRight: true,
            isLeft: false, isTop: false,
        });
    });

    it('should detect if cell is on the top', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(0, 1, selectionRange)).toEqual({
            isTop: true, isSelected: true,
            isLeft: false, isRight: false, isBottom: false, isStartCell: false,
        });
    });

    it('should detect if cell is at the bottom', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(4, 1, selectionRange)).toEqual({
            isBottom: true, isSelected: true,
            isLeft: false, isRight: false, isTop: false, isStartCell: false,
        });
    });

    it('should detect if cell is on the left side', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(2, 0, selectionRange)).toEqual({
            isLeft: true, isSelected: true,
            isBottom: false, isRight: false, isTop: false, isStartCell: false,
        });
    });

    it('should detect if cell is on the right side', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(2, 4, selectionRange)).toEqual({
            isRight: true, isSelected: true,
            isLeft: false, isTop: false, isStartCell: false, isBottom: false,
        });
    });

    it('should detect if cell is in the right bottom corner', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(4, 4, selectionRange)).toEqual({
            isRight: true, isSelected: true, isBottom: true,
            isLeft: false, isTop: false, isStartCell: false,
        });
    });

    it('should detect if cell is in the left bottom corner', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(4, 0, selectionRange)).toEqual({
            isLeft: true, isSelected: true, isBottom: true,
            isRight: false, isTop: false, isStartCell: false,
        });
    });

    it('should detect if cell is in the right top corner', () => {
        const selectionRange = { startColumnIndex: 0, startRowIndex: 0, endColumnIndex: 4, endRowIndex: 4 };
        expect(getCellPosition(0, 4, selectionRange)).toEqual({
            isRight: true, isTop: true, isSelected: true,
            isBottom: false, isLeft: false, isStartCell: false,
        });
    });
});
