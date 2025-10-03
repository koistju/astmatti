namespace ManagerApp
{
    partial class FormChatDesigner
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            DevExpress.XtraGrid.GridLevelNode gridLevelNode1 = new DevExpress.XtraGrid.GridLevelNode();
            DevExpress.XtraGrid.GridLevelNode gridLevelNode2 = new DevExpress.XtraGrid.GridLevelNode();
            this.gridViewButtons = new DevExpress.XtraGrid.Views.Grid.GridView();
            this.gridColumn5 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridColumn6 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridColumn7 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.riNextItem = new DevExpress.XtraEditors.Repository.RepositoryItemLookUpEdit();
            this.gridControlChat = new DevExpress.XtraGrid.GridControl();
            this.gridViewUrl_extra = new DevExpress.XtraGrid.Views.Grid.GridView();
            this.gridColumn8 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridColumn9 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridColumn10 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridViewChat = new DevExpress.XtraGrid.Views.Grid.GridView();
            this.gridColumn1 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.gridColumn2 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.riChatText = new DevExpress.XtraEditors.Repository.RepositoryItemMemoEdit();
            this.gridColumn3 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.riChatAction = new DevExpress.XtraEditors.Repository.RepositoryItemComboBox();
            this.gridColumn4 = new DevExpress.XtraGrid.Columns.GridColumn();
            this.groupControl1 = new DevExpress.XtraEditors.GroupControl();
            this.teResult = new DevExpress.XtraEditors.TextEdit();
            this.teTest = new DevExpress.XtraEditors.TextEdit();
            this.buttonCreateThumbnail = new DevExpress.XtraEditors.SimpleButton();
            this.styleController1 = new DevExpress.XtraEditors.StyleController(this.components);
            this.buttonSaveFile = new DevExpress.XtraEditors.SimpleButton();
            this.teFilename = new DevExpress.XtraEditors.TextEdit();
            this.buttonLoadChatFile = new DevExpress.XtraEditors.SimpleButton();
            this.openFileDialog = new System.Windows.Forms.OpenFileDialog();
            ((System.ComponentModel.ISupportInitialize)(this.gridViewButtons)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.riNextItem)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridControlChat)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridViewUrl_extra)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridViewChat)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.riChatText)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.riChatAction)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.groupControl1)).BeginInit();
            this.groupControl1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.teResult.Properties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.teTest.Properties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.styleController1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.teFilename.Properties)).BeginInit();
            this.SuspendLayout();
            // 
            // gridViewButtons
            // 
            this.gridViewButtons.Columns.AddRange(new DevExpress.XtraGrid.Columns.GridColumn[] {
            this.gridColumn5,
            this.gridColumn6,
            this.gridColumn7});
            this.gridViewButtons.GridControl = this.gridControlChat;
            this.gridViewButtons.Name = "gridViewButtons";
            this.gridViewButtons.OptionsView.NewItemRowPosition = DevExpress.XtraGrid.Views.Grid.NewItemRowPosition.Bottom;
            this.gridViewButtons.OptionsView.ShowGroupPanel = false;
            this.gridViewButtons.ViewCaption = "Toiminnot";
            this.gridViewButtons.FocusedRowChanged += new DevExpress.XtraGrid.Views.Base.FocusedRowChangedEventHandler(this.gridViewButtons_FocusedRowChanged);
            this.gridViewButtons.RowUpdated += new DevExpress.XtraGrid.Views.Base.RowObjectEventHandler(this.gridViewButtons_RowUpdated);
            this.gridViewButtons.KeyDown += new System.Windows.Forms.KeyEventHandler(this.gridViewButtons_KeyDown);
            // 
            // gridColumn5
            // 
            this.gridColumn5.AppearanceCell.Font = new System.Drawing.Font("Tahoma", 7.8F, System.Drawing.FontStyle.Bold);
            this.gridColumn5.AppearanceCell.ForeColor = System.Drawing.Color.Silver;
            this.gridColumn5.AppearanceCell.Options.UseFont = true;
            this.gridColumn5.AppearanceCell.Options.UseForeColor = true;
            this.gridColumn5.Caption = "Id";
            this.gridColumn5.FieldName = "Id";
            this.gridColumn5.Name = "gridColumn5";
            this.gridColumn5.OptionsColumn.AllowEdit = false;
            this.gridColumn5.OptionsColumn.ReadOnly = true;
            this.gridColumn5.Visible = true;
            this.gridColumn5.VisibleIndex = 0;
            this.gridColumn5.Width = 50;
            // 
            // gridColumn6
            // 
            this.gridColumn6.Caption = "Text";
            this.gridColumn6.FieldName = "Text";
            this.gridColumn6.Name = "gridColumn6";
            this.gridColumn6.Visible = true;
            this.gridColumn6.VisibleIndex = 1;
            this.gridColumn6.Width = 500;
            // 
            // gridColumn7
            // 
            this.gridColumn7.Caption = "NextId";
            this.gridColumn7.ColumnEdit = this.riNextItem;
            this.gridColumn7.FieldName = "NextId";
            this.gridColumn7.Name = "gridColumn7";
            this.gridColumn7.Visible = true;
            this.gridColumn7.VisibleIndex = 2;
            this.gridColumn7.Width = 700;
            // 
            // riNextItem
            // 
            this.riNextItem.AllowNullInput = DevExpress.Utils.DefaultBoolean.True;
            this.riNextItem.AutoHeight = false;
            this.riNextItem.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.riNextItem.Columns.AddRange(new DevExpress.XtraEditors.Controls.LookUpColumnInfo[] {
            new DevExpress.XtraEditors.Controls.LookUpColumnInfo("Text", "Text"),
            new DevExpress.XtraEditors.Controls.LookUpColumnInfo("Id", "Id", 20, DevExpress.Utils.FormatType.None, "", false, DevExpress.Utils.HorzAlignment.Default)});
            this.riNextItem.DisplayMember = "Text";
            this.riNextItem.Name = "riNextItem";
            this.riNextItem.NullText = "";
            this.riNextItem.ValueMember = "Id";
            this.riNextItem.EditValueChanged += new System.EventHandler(this.riNextItem_EditValueChanged);
            // 
            // gridControlChat
            // 
            this.gridControlChat.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            gridLevelNode1.LevelTemplate = this.gridViewButtons;
            gridLevelNode1.RelationName = "Buttons";
            gridLevelNode2.LevelTemplate = this.gridViewUrl_extra;
            gridLevelNode2.RelationName = "Url_extra";
            this.gridControlChat.LevelTree.Nodes.AddRange(new DevExpress.XtraGrid.GridLevelNode[] {
            gridLevelNode1,
            gridLevelNode2});
            this.gridControlChat.Location = new System.Drawing.Point(0, 124);
            this.gridControlChat.LookAndFeel.SkinName = "Office 2010 Blue";
            this.gridControlChat.LookAndFeel.UseDefaultLookAndFeel = false;
            this.gridControlChat.MainView = this.gridViewChat;
            this.gridControlChat.Margin = new System.Windows.Forms.Padding(10);
            this.gridControlChat.Name = "gridControlChat";
            this.gridControlChat.RepositoryItems.AddRange(new DevExpress.XtraEditors.Repository.RepositoryItem[] {
            this.riChatAction,
            this.riNextItem,
            this.riChatText});
            this.gridControlChat.Size = new System.Drawing.Size(1310, 382);
            this.gridControlChat.TabIndex = 0;
            this.gridControlChat.ViewCollection.AddRange(new DevExpress.XtraGrid.Views.Base.BaseView[] {
            this.gridViewUrl_extra,
            this.gridViewChat,
            this.gridViewButtons});
            // 
            // gridViewUrl_extra
            // 
            this.gridViewUrl_extra.Columns.AddRange(new DevExpress.XtraGrid.Columns.GridColumn[] {
            this.gridColumn8,
            this.gridColumn9,
            this.gridColumn10});
            this.gridViewUrl_extra.GridControl = this.gridControlChat;
            this.gridViewUrl_extra.Name = "gridViewUrl_extra";
            this.gridViewUrl_extra.OptionsView.NewItemRowPosition = DevExpress.XtraGrid.Views.Grid.NewItemRowPosition.Bottom;
            this.gridViewUrl_extra.ViewCaption = "Videot ja linkit";
            // 
            // gridColumn8
            // 
            this.gridColumn8.Caption = "Name";
            this.gridColumn8.FieldName = "Name";
            this.gridColumn8.Name = "gridColumn8";
            this.gridColumn8.Visible = true;
            this.gridColumn8.VisibleIndex = 0;
            // 
            // gridColumn9
            // 
            this.gridColumn9.Caption = "Url";
            this.gridColumn9.FieldName = "Url";
            this.gridColumn9.Name = "gridColumn9";
            this.gridColumn9.Visible = true;
            this.gridColumn9.VisibleIndex = 1;
            // 
            // gridColumn10
            // 
            this.gridColumn10.Caption = "Thumbnail";
            this.gridColumn10.FieldName = "Thumbnail";
            this.gridColumn10.Name = "gridColumn10";
            this.gridColumn10.Visible = true;
            this.gridColumn10.VisibleIndex = 2;
            // 
            // gridViewChat
            // 
            this.gridViewChat.Appearance.FocusedRow.ForeColor = System.Drawing.Color.Red;
            this.gridViewChat.Appearance.FocusedRow.Options.UseForeColor = true;
            this.gridViewChat.Columns.AddRange(new DevExpress.XtraGrid.Columns.GridColumn[] {
            this.gridColumn1,
            this.gridColumn2,
            this.gridColumn3,
            this.gridColumn4});
            this.gridViewChat.GridControl = this.gridControlChat;
            this.gridViewChat.Name = "gridViewChat";
            this.gridViewChat.OptionsDetail.AllowExpandEmptyDetails = true;
            this.gridViewChat.OptionsView.NewItemRowPosition = DevExpress.XtraGrid.Views.Grid.NewItemRowPosition.Bottom;
            this.gridViewChat.OptionsView.RowAutoHeight = true;
            this.gridViewChat.OptionsView.ShowGroupPanel = false;
            this.gridViewChat.RowStyle += new DevExpress.XtraGrid.Views.Grid.RowStyleEventHandler(this.gridViewChat_RowStyle);
            this.gridViewChat.MasterRowExpanded += new DevExpress.XtraGrid.Views.Grid.CustomMasterRowEventHandler(this.gridViewChat_MasterRowExpanded);
            this.gridViewChat.RowUpdated += new DevExpress.XtraGrid.Views.Base.RowObjectEventHandler(this.gridViewChat_RowUpdated);
            this.gridViewChat.KeyDown += new System.Windows.Forms.KeyEventHandler(this.gridViewChat_KeyDown);
            // 
            // gridColumn1
            // 
            this.gridColumn1.Caption = "Id";
            this.gridColumn1.FieldName = "Id";
            this.gridColumn1.Name = "gridColumn1";
            this.gridColumn1.OptionsColumn.AllowEdit = false;
            this.gridColumn1.OptionsColumn.ReadOnly = true;
            this.gridColumn1.Visible = true;
            this.gridColumn1.VisibleIndex = 0;
            this.gridColumn1.Width = 40;
            // 
            // gridColumn2
            // 
            this.gridColumn2.Caption = "Text";
            this.gridColumn2.ColumnEdit = this.riChatText;
            this.gridColumn2.FieldName = "Text";
            this.gridColumn2.Name = "gridColumn2";
            this.gridColumn2.Visible = true;
            this.gridColumn2.VisibleIndex = 1;
            this.gridColumn2.Width = 800;
            // 
            // riChatText
            // 
            this.riChatText.LookAndFeel.SkinName = "Office 2010 Blue";
            this.riChatText.LookAndFeel.UseDefaultLookAndFeel = false;
            this.riChatText.Name = "riChatText";
            // 
            // gridColumn3
            // 
            this.gridColumn3.Caption = "Action";
            this.gridColumn3.ColumnEdit = this.riChatAction;
            this.gridColumn3.FieldName = "Action";
            this.gridColumn3.Name = "gridColumn3";
            this.gridColumn3.Visible = true;
            this.gridColumn3.VisibleIndex = 2;
            this.gridColumn3.Width = 199;
            // 
            // riChatAction
            // 
            this.riChatAction.AllowNullInput = DevExpress.Utils.DefaultBoolean.True;
            this.riChatAction.AutoHeight = false;
            this.riChatAction.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.riChatAction.LookAndFeel.SkinName = "Office 2010 Blue";
            this.riChatAction.LookAndFeel.UseDefaultLookAndFeel = false;
            this.riChatAction.Name = "riChatAction";
            this.riChatAction.NullText = " ";
            // 
            // gridColumn4
            // 
            this.gridColumn4.Caption = "NextId";
            this.gridColumn4.ColumnEdit = this.riNextItem;
            this.gridColumn4.FieldName = "NextId";
            this.gridColumn4.Name = "gridColumn4";
            this.gridColumn4.Visible = true;
            this.gridColumn4.VisibleIndex = 3;
            this.gridColumn4.Width = 251;
            // 
            // groupControl1
            // 
            this.groupControl1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.groupControl1.Controls.Add(this.teResult);
            this.groupControl1.Controls.Add(this.teTest);
            this.groupControl1.Controls.Add(this.buttonCreateThumbnail);
            this.groupControl1.Controls.Add(this.buttonSaveFile);
            this.groupControl1.Controls.Add(this.teFilename);
            this.groupControl1.Controls.Add(this.buttonLoadChatFile);
            this.groupControl1.Location = new System.Drawing.Point(0, 0);
            this.groupControl1.LookAndFeel.SkinName = "Office 2010 Blue";
            this.groupControl1.LookAndFeel.UseDefaultLookAndFeel = false;
            this.groupControl1.Name = "groupControl1";
            this.groupControl1.Size = new System.Drawing.Size(1310, 124);
            this.groupControl1.TabIndex = 1;
            this.groupControl1.Text = "Commands";
            // 
            // teResult
            // 
            this.teResult.Location = new System.Drawing.Point(857, 73);
            this.teResult.Name = "teResult";
            this.teResult.Size = new System.Drawing.Size(289, 22);
            this.teResult.TabIndex = 5;
            // 
            // teTest
            // 
            this.teTest.EditValue = "2019-04-05 08:44";
            this.teTest.Location = new System.Drawing.Point(857, 44);
            this.teTest.Name = "teTest";
            this.teTest.Size = new System.Drawing.Size(289, 22);
            this.teTest.TabIndex = 4;
            // 
            // buttonCreateThumbnail
            // 
            this.buttonCreateThumbnail.Location = new System.Drawing.Point(683, 44);
            this.buttonCreateThumbnail.Name = "buttonCreateThumbnail";
            this.buttonCreateThumbnail.Size = new System.Drawing.Size(158, 23);
            this.buttonCreateThumbnail.StyleController = this.styleController1;
            this.buttonCreateThumbnail.TabIndex = 3;
            this.buttonCreateThumbnail.Text = "Create thumbnail";
            this.buttonCreateThumbnail.Click += new System.EventHandler(this.buttonCreateThumbnail_Click);
            // 
            // styleController1
            // 
            this.styleController1.LookAndFeel.SkinName = "Office 2010 Blue";
            this.styleController1.LookAndFeel.UseDefaultLookAndFeel = false;
            // 
            // buttonSaveFile
            // 
            this.buttonSaveFile.Location = new System.Drawing.Point(12, 68);
            this.buttonSaveFile.Name = "buttonSaveFile";
            this.buttonSaveFile.Size = new System.Drawing.Size(158, 23);
            this.buttonSaveFile.StyleController = this.styleController1;
            this.buttonSaveFile.TabIndex = 2;
            this.buttonSaveFile.Text = "Save chat file";
            this.buttonSaveFile.Click += new System.EventHandler(this.buttonSaveFile_Click);
            // 
            // teFilename
            // 
            this.teFilename.Location = new System.Drawing.Point(187, 41);
            this.teFilename.Name = "teFilename";
            this.teFilename.Properties.ReadOnly = true;
            this.teFilename.Size = new System.Drawing.Size(422, 22);
            this.teFilename.TabIndex = 1;
            // 
            // buttonLoadChatFile
            // 
            this.buttonLoadChatFile.Location = new System.Drawing.Point(12, 39);
            this.buttonLoadChatFile.Name = "buttonLoadChatFile";
            this.buttonLoadChatFile.Size = new System.Drawing.Size(158, 23);
            this.buttonLoadChatFile.StyleController = this.styleController1;
            this.buttonLoadChatFile.TabIndex = 0;
            this.buttonLoadChatFile.Text = "Load chat file";
            this.buttonLoadChatFile.Click += new System.EventHandler(this.buttonLoadChatFile_Click);
            // 
            // openFileDialog
            // 
            this.openFileDialog.FileName = "openFileDialog";
            this.openFileDialog.InitialDirectory = "C:\\_Omat\\Business\\Sense4Health\\Koodit\\astmatti\\";
            // 
            // FormChatDesigner
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1310, 506);
            this.Controls.Add(this.groupControl1);
            this.Controls.Add(this.gridControlChat);
            this.Name = "FormChatDesigner";
            this.Text = "Form1";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            ((System.ComponentModel.ISupportInitialize)(this.gridViewButtons)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.riNextItem)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridControlChat)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridViewUrl_extra)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.gridViewChat)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.riChatText)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.riChatAction)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.groupControl1)).EndInit();
            this.groupControl1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.teResult.Properties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.teTest.Properties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.styleController1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.teFilename.Properties)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private DevExpress.XtraGrid.GridControl gridControlChat;
        private DevExpress.XtraGrid.Views.Grid.GridView gridViewChat;
        private DevExpress.XtraEditors.GroupControl groupControl1;
        private DevExpress.XtraEditors.SimpleButton buttonLoadChatFile;
        private System.Windows.Forms.OpenFileDialog openFileDialog;
        private DevExpress.XtraEditors.StyleController styleController1;
        private DevExpress.XtraEditors.TextEdit teFilename;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn1;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn2;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn3;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn4;
        private DevExpress.XtraEditors.Repository.RepositoryItemComboBox riChatAction;
        private DevExpress.XtraEditors.Repository.RepositoryItemLookUpEdit riNextItem;
        private DevExpress.XtraEditors.Repository.RepositoryItemMemoEdit riChatText;
        private DevExpress.XtraEditors.SimpleButton buttonSaveFile;
        private DevExpress.XtraGrid.Views.Grid.GridView gridViewButtons;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn5;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn6;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn7;
        private DevExpress.XtraEditors.SimpleButton buttonCreateThumbnail;
        private DevExpress.XtraGrid.Views.Grid.GridView gridViewUrl_extra;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn8;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn9;
        private DevExpress.XtraGrid.Columns.GridColumn gridColumn10;
        private DevExpress.XtraEditors.TextEdit teTest;
        private DevExpress.XtraEditors.TextEdit teResult;
    }
}

