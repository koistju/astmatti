using DevExpress.XtraEditors;
using DevExpress.XtraGrid.Views.Grid;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ManagerApp
{
    public partial class FormChatDesigner : Form
    {
        public BindingList<ChatItem> _listChatItem;
        public List<ChatAction> _listChatAction;
        public FormChatDesigner()
        {
            InitializeComponent();
            _listChatItem = new BindingList<ChatItem>();
            _listChatAction = new List<ChatAction>();

            LoadChatActions();
        }

        private void LoadChatActions()
        {
            _listChatAction.Add(ChatAction.PERSONAL_DATA);
            _listChatAction.Add(ChatAction.OPEN_GUIDE);
            _listChatAction.Add(ChatAction.SHOW_VIDEO);

            riChatAction.Items.AddRange(_listChatAction);
        }

        private void ReadChatFile(string path)
        {
            try
            {
                string[] lines = File.ReadAllLines(path);
                // Remove first line, it contains variable name "data" for React

                var x = lines.Where(t => !t.StartsWith("data")).Select(t => t);
                string json_data = String.Join("", x);
                _listChatItem = JsonConvert.DeserializeObject<BindingList<ChatItem>>(json_data);

                foreach(var chatItem in _listChatItem)
                {
                    if (chatItem.Buttons == null) chatItem.Buttons = new BindingList<ChatButton>();
                    if (chatItem.Url_extra == null) chatItem.Url_extra = new BindingList<Url_extra>();
                }

                // Create repo item for nextid
                riNextItem.DataSource = _listChatItem;

                gridControlChat.DataSource = _listChatItem;
                //gridViewChat.BestFitColumns();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error when reading chat file, reason: " + ex.Message);
            }
        }

        private void buttonLoadChatFile_Click(object sender, EventArgs e)
        {
            DialogResult dr = openFileDialog.ShowDialog();
            if ( dr == DialogResult.OK )
            {
                string filename = openFileDialog.FileName;
                teFilename.Text = filename;
                ReadChatFile(filename);
            }
        }

        private int GetNewId()
        {
            return _listChatItem.Max(t => t.Id) + 1;
        }

        private void gridViewChat_RowUpdated(object sender, DevExpress.XtraGrid.Views.Base.RowObjectEventArgs e)
        {
            ChatItem chatItem = e.Row as ChatItem;
            if ( chatItem != null )
            {
                if (chatItem.Id == 0)
                    chatItem.Id = GetNewId();
                if ( chatItem.Buttons == null )
                    chatItem.Buttons = new BindingList<ChatButton>();
                
            }
        }

        private void buttonSaveFile_Click(object sender, EventArgs e)
        {
            foreach (var chatItem in _listChatItem)
            {
                if (chatItem.Buttons == null) continue;
                if (chatItem.Buttons.Count == 0 ) chatItem.Buttons = null;
            }

            string json_data = JsonConvert.SerializeObject(_listChatItem, Formatting.Indented);
            File.WriteAllText(teFilename.Text, json_data);                
        }

        private int GetNewButtonId()
        {
            var all_buttons = (from chatItems in _listChatItem
                               from chatButton in chatItems.Buttons != null ? chatItems.Buttons : new BindingList<ChatButton>()
                               select chatButton).ToList();

            return all_buttons.Max(t => t.Id) + 1;
        }


        private void gridViewButtons_RowUpdated(object sender, DevExpress.XtraGrid.Views.Base.RowObjectEventArgs e)
        {
            GridView view = sender as GridView;
            int parent_row = view.SourceRowHandle;
            ChatItem chatItem = gridViewChat.GetRow(parent_row) as ChatItem;

            ChatButton chatButton = e.Row as ChatButton;
            if (chatButton != null)
            {
                if ( chatButton.Id == 0 )
                    chatButton.Id = GetNewButtonId();
            }
        }

        private void gridViewButtons_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Delete)
            {
                if (MessageBox.Show("Are you sure you want to delete the selected line?", "Confirmation", MessageBoxButtons.YesNo) != DialogResult.Yes)
                    return;

                GridView view = sender as GridView;
                int parent_row = view.SourceRowHandle;
                ChatItem chatItem = gridViewChat.GetRow(parent_row) as ChatItem;

                ChatButton chatButton = view.GetRow(view.FocusedRowHandle) as ChatButton;
                if (chatButton != null)
                {
                    chatItem.Buttons.Remove(chatButton);
                }
            }
        }

        private void riNextItem_EditValueChanged(object sender, EventArgs e)
        {
            LookUpEdit lookUp = sender as LookUpEdit;
            if ( lookUp != null )
            {
                int id = (int)lookUp.EditValue;
                int rowHandle = gridViewChat.LocateByValue("Id", id);

                gridViewChat.FocusedRowHandle = rowHandle;

                /*
                foreach (var item in _listChatItem)
                    item.Tag = null;

                var chatItem = _listChatItem.Where(t => t.Id == id).SingleOrDefault();
                if (chatItem != null)
                    chatItem.Tag = "X";

    
                gridViewChat.RefreshData(); */
            }
        }

        private void gridViewChat_RowStyle(object sender, RowStyleEventArgs e)
        {
            /*
                        ChatItem chatItem = gridViewChat.GetRow(e.RowHandle) as ChatItem;
                        if ( chatItem != null )
                        {
                            if ( !String.IsNullOrEmpty(chatItem.Tag) )
                            {
                                e.Appearance.ForeColor = Color.Red;
                            }
                        }
            */
            GridView view = (GridView)sender;
            if ((e.State & DevExpress.XtraGrid.Views.Base.GridRowCellState.Focused) == DevExpress.XtraGrid.Views.Base.GridRowCellState.Focused)
            {
                e.Appearance.Assign(view.GetViewInfo().PaintAppearance.GetAppearance("FocusedRow"));
            }
        }

        private void gridViewButtons_FocusedRowChanged(object sender, DevExpress.XtraGrid.Views.Base.FocusedRowChangedEventArgs e)
        {
            GridView view = sender as GridView;
            ChatButton chatButton = view.GetRow(e.FocusedRowHandle) as ChatButton;
            if ( chatButton != null )
            {
                int rowHandle = gridViewChat.LocateByValue("Id", chatButton.NextId);
                gridViewChat.FocusedRowHandle = rowHandle;
            }
        }

        private void gridViewChat_MasterRowExpanded(object sender, CustomMasterRowEventArgs e)
        {
            GridView view = sender as GridView;
            //((GridView)view.GetVisibleDetailView(e.RowHandle)).BestFitColumns();

        }

        private void gridViewChat_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Delete)
            {
                if (MessageBox.Show("Are you sure you want to delete the selected line?", "Confirmation", MessageBoxButtons.YesNo) != DialogResult.Yes)
                    return;

                GridView view = sender as GridView;
                ChatItem chatItem = gridViewChat.GetRow(view.FocusedRowHandle) as ChatItem;

                if (chatItem != null)
                {
                    _listChatItem.Remove(chatItem);
                }
            }
        }

        private void buttonCreateThumbnail_Click(object sender, EventArgs e)
        {
            /*
            string pathToVideoFile = @"C:\_Omat\Business\Sense4Health\Materiaali OYS\Spirometria_v2_tekstiton.mp4";
            string thumbnailPath = @"C:\_Omat\Business\Sense4Health\Materiaali OYS\Spirometria_v2_tekstiton.png";
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.GetVideoThumbnail(pathToVideoFile, thumbnailPath, 9);
            */

            /*
            DateTimeFormatInfo formatInfo = new DateTimeFormatInfo();
            DateTime dt = DateTime.Now;
            this.Text = dt.ToString();
            //bool result = DateTime.TryParse(teTest.Text, out dt);
            string format = string.Format("yyyy-MM-ddTHH{0}mm{0}00{0}0000000+02{0}00", formatInfo.TimeSeparator);
            bool result = DateTime.TryParseExact(teTest.Text, format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out dt);
            teResult.Text = result.ToString();
            */

            DateTime dt = new DateTime(2019, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            DateTime reception_date;
            bool result = DateTime.TryParse(teTest.Text, out reception_date);
            DateTime.SpecifyKind(reception_date, DateTimeKind.Local);

            var diff = reception_date.ToUniversalTime().Subtract(dt);
            int minutes = (int)Math.Round(diff.TotalMinutes);
            teResult.Text = minutes.ToString();
        }
    }
}

