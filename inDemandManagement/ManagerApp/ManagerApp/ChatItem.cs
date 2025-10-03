using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ManagerApp
{
    public class ChatItem
    {
        public int Id { get; set; }
        public string Text {get; set;}
        /*private BindingList<ChatButton> _buttons;
        public BindingList<ChatButton> Buttons
        {
            get
            {
                if (_buttons != null)
                    return _buttons.Count > 0 ? _buttons : null;
                else
                    return null;
            }
            set
            {
                if (value == null) _buttons = new BindingList<ChatButton>();
                else _buttons = value;
            }
        }*/
        public BindingList<ChatButton> Buttons { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Nullable<ChatAction> Action { get; set; }
        public Nullable<int> NextId { get; set; }
        public string Tag { get; set; }
        public BindingList<Url_extra> Url_extra { get; set; }
    }
}
