/**
 * Interface representing the data structure of a Mutable Notebook
 * @interface NotebookData
 * @property {string[]} models - Array of model paths used in the notebook
 * @property {NotebookCellValue[]} cells - Array of cells in the notebook
 * @property {string} notebookPath - Path to the notebook file (relative to project/package)
 */
export interface NotebookData {
   models: string[];
   cells: NotebookCellValue[];
   notebookPath: string;
}

/**
 * Interface representing a cell in the notebook
 * @interface NotebookCellValue
 * @property {boolean} isMarkdown - Whether the cell is a markdown cell
 * @property {string} [value] - The content of the cell
 * @property {string} [result] - The result of executing the cell
 * @property {string} [modelName] - Name of the model associated with the cell
 * @property {string} [sourceName] - Name of the source associated with the cell
 * @property {string} [queryInfo] - Information about the query in the cell
 */
export interface NotebookCellValue {
   isMarkdown: boolean;
   value?: string;
   result?: string;
   modelName?: string;
   sourceName?: string;
   queryInfo?: string;
}

/**
 * Class for managing notebook operations
 * @class NotebookManager
 */
export class NotebookManager {
   private isSaved: boolean;

   /**
    * Creates a new NotebookManager instance
    * @param {string} projectName - Name of the project
    * @param {string} packageName - Name of the package
    * @param {NotebookData} notebookData - Initial notebook data
    */
   constructor(
      private projectName: string,
      private packageName: string,
      private notebookData: NotebookData,
   ) {
      if (this.notebookData) {
         this.isSaved = true;
      } else {
         this.notebookData = {
            models: [],
            cells: [],
            notebookPath: undefined,
         };
         this.isSaved = false;
      }
   }

   /**
    * Gets the current notebook data
    * @returns {NotebookData} The current notebook data
    */
   getNotebookData(): NotebookData {
      return this.notebookData;
   }

   /**
    * Gets the current notebook path
    * @returns {string} The path to the notebook
    */
   getNotebookPath(): string {
      return this.notebookData.notebookPath;
   }

   /**
    * Renames the notebook and updates storage
    * @param {string} notebookPath - New path for the notebook
    * @returns {NotebookManager} The updated NotebookManager instance
    */
   renameNotebook(notebookPath: string): NotebookManager {
      if (this.notebookData.notebookPath !== notebookPath) {
         localStorage.removeItem(
            `notebook__${this.projectName}__${this.packageName}__${this.notebookData.notebookPath}`,
         );
      }
      this.notebookData.notebookPath = notebookPath;
      this.isSaved = false;
      this.saveNotebook();
      return this;
   }

   getCells(): NotebookCellValue[] {
      return this.notebookData.cells;
   }
   deleteCell(index: number): NotebookManager {
      this.notebookData.cells = [
         ...this.notebookData.cells.slice(0, index),
         ...this.notebookData.cells.slice(index + 1),
      ];
      this.isSaved = false;
      return this;
   }
   insertCell(index: number, cell: NotebookCellValue): NotebookManager {
      this.notebookData.cells = [
         ...this.notebookData.cells.slice(0, index),
         cell,
         ...this.notebookData.cells.slice(index),
      ];
      this.isSaved = false;
      return this;
   }
   setCell(index: number, cell: NotebookCellValue): NotebookManager {
      this.notebookData.cells[index] = cell;
      this.isSaved = false;
      return this;
   }
   setModels(models: string[]): NotebookManager {
      this.notebookData.models = models;
      this.isSaved = false;
      return this;
   }
   getModels(): string[] {
      return this.notebookData.models;
   }

   updateNotebookData(notebookData: NotebookData): NotebookManager {
      this.notebookData = notebookData;
      this.isSaved = false;
      return this;
   }

   saveNotebook(): NotebookManager {
      if (!this.isSaved) {
         localStorage.setItem(
            `notebook__${this.projectName}__${this.packageName}__${this.notebookData.notebookPath}`,
            JSON.stringify(this.notebookData),
         );
         console.log("saving: ", this.notebookData);
         this.isSaved = true;
      }
      return new NotebookManager(
         this.projectName,
         this.packageName,
         this.notebookData,
      );
   }

   static newNotebook(
      projectName: string,
      packageName: string,
   ): NotebookManager {
      return new NotebookManager(projectName, packageName, undefined);
   }

   /**
    * Creates a new notebook manager by loading from local storage.
    * Returns an empty instance if the notebook is not found.
    * @param projectName - The name of the project
    * @param packageName - The name of the package
    * @param notebookPath - The path to the notebook file (relative to project/package)
    */
   static loadNotebook(
      projectName: string,
      packageName: string,
      notebookPath: string,
   ): NotebookManager {
      const savedSnippet = localStorage.getItem(
         `notebook__${projectName}__${packageName}__${notebookPath}`,
      );
      if (savedSnippet) {
         const notebookData = JSON.parse(savedSnippet);
         console.log("loading cells", notebookData.cells);
         console.log("loading notebookData", notebookData);
         return new NotebookManager(projectName, packageName, notebookData);
      }
      return new NotebookManager(projectName, packageName, undefined);
   }
}
